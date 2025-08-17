#!/usr/bin/env python3
"""
Model Compression System
모델 압축 시스템 메인 진입점 (통합 버전)
"""

import argparse
import os
import time
import torch
import torch.nn as nn
import psutil
import numpy as np
from pathlib import Path

# 통합된 압축 모듈 import
from compression import compress_model, analyze_compression_results

def create_results_dir():
    """테스트 결과 저장 디렉토리 생성"""
    results_dir = Path("results")
    results_dir.mkdir(exist_ok=True)
    return results_dir

def load_model(model_name="distilbert-base-uncased"):
    """압축 대상 모델 로드"""
    try:
        from transformers import AutoModel, AutoTokenizer
        print(f"Loading model: {model_name}")
        model = AutoModel.from_pretrained(model_name)
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        
        # 모델 기본 정보 출력
        param_count = sum(p.numel() for p in model.parameters())
        print(f"Model parameters: {param_count:,}")
        print(f"Model size: {param_count * 4 / 1024 / 1024:.2f} MB")
        
        return model, tokenizer
    except ImportError:
        print("Error: transformers library not installed")
        print("Install with: pip install transformers torch")
        return None, None

def measure_model_size(model):
    """모델 크기 측정 (파라미터 수, 메모리 사용량)"""
    # 파라미터 수 계산
    total_params = sum(p.numel() for p in model.parameters())
    trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
    
    # 메모리 사용량 계산 (바이트)
    param_size = 0
    buffer_size = 0
    
    for param in model.parameters():
        param_size += param.nelement() * param.element_size()
    
    for buffer in model.buffers():
        buffer_size += buffer.nelement() * buffer.element_size()
    
    model_size_mb = (param_size + buffer_size) / 1024 / 1024
    
    print(f"Total parameters: {total_params:,}")
    print(f"Trainable parameters: {trainable_params:,}")
    print(f"Model size: {model_size_mb:.2f} MB")
    
    return {
        'total_params': total_params,
        'trainable_params': trainable_params,
        'size_mb': model_size_mb
    }

def measure_inference_speed(model, sample_inputs, num_runs=50, warmup_runs=5):
    """추론 속도 측정"""
    model.eval()
    device = next(model.parameters()).device
    
    # 입력 데이터를 같은 디바이스로 이동
    if isinstance(sample_inputs, dict):
        sample_inputs = {k: v.to(device) if torch.is_tensor(v) else v 
                        for k, v in sample_inputs.items()}
    
    # Warmup
    print(f"Warming up with {warmup_runs} runs...")
    with torch.no_grad():
        for _ in range(warmup_runs):
            _ = model(**sample_inputs)
    
    # 실제 측정
    print(f"Measuring inference speed with {num_runs} runs...")
    times = []
    
    with torch.no_grad():
        for _ in range(num_runs):
            start_time = time.perf_counter()
            _ = model(**sample_inputs)
            
            if device.type == 'cuda':
                torch.cuda.synchronize()
            
            end_time = time.perf_counter()
            times.append(end_time - start_time)
    
    # 통계 계산
    avg_time = np.mean(times)
    std_time = np.std(times)
    min_time = np.min(times)
    max_time = np.max(times)
    
    print(f"Average inference time: {avg_time*1000:.2f} ± {std_time*1000:.2f} ms")
    print(f"Min/Max time: {min_time*1000:.2f} / {max_time*1000:.2f} ms")
    print(f"Throughput: {1/avg_time:.1f} inferences/sec")
    
    return {
        'avg_time': avg_time,
        'std_time': std_time,
        'min_time': min_time,
        'max_time': max_time,
        'throughput': 1/avg_time
    }

def measure_memory_usage(model, sample_inputs):
    """메모리 사용량 측정"""
    device = next(model.parameters()).device
    
    if device.type == 'cuda':
        # GPU 메모리 측정
        torch.cuda.empty_cache()
        torch.cuda.reset_peak_memory_stats()
        
        memory_before = torch.cuda.memory_allocated()
        
        with torch.no_grad():
            outputs = model(**sample_inputs)
        
        memory_after = torch.cuda.memory_allocated()
        peak_memory = torch.cuda.max_memory_allocated()
        
        memory_usage = {
            'memory_before_mb': memory_before / 1024 / 1024,
            'memory_after_mb': memory_after / 1024 / 1024,
            'peak_memory_mb': peak_memory / 1024 / 1024,
            'memory_increase_mb': (memory_after - memory_before) / 1024 / 1024
        }
        
        print(f"GPU Memory - Before: {memory_usage['memory_before_mb']:.2f} MB")
        print(f"GPU Memory - After: {memory_usage['memory_after_mb']:.2f} MB")
        print(f"GPU Memory - Peak: {memory_usage['peak_memory_mb']:.2f} MB")
        
    else:
        # CPU 메모리 측정
        process = psutil.Process(os.getpid())
        memory_before = process.memory_info().rss / 1024 / 1024
        
        with torch.no_grad():
            outputs = model(**sample_inputs)
        
        memory_after = process.memory_info().rss / 1024 / 1024
        
        memory_usage = {
            'memory_before_mb': memory_before,
            'memory_after_mb': memory_after,
            'memory_increase_mb': memory_after - memory_before
        }
        
        print(f"CPU Memory - Before: {memory_usage['memory_before_mb']:.2f} MB")
        print(f"CPU Memory - After: {memory_usage['memory_after_mb']:.2f} MB")
    
    return memory_usage

def compare_models(original_model, compressed_model, test_inputs):
    """원본 모델과 압축 모델 비교"""
    print("=" * 50)
    print("MODEL COMPARISON RESULTS")
    print("=" * 50)
    
    # 크기 비교
    print("\n--- Model Size Comparison ---")
    orig_size = measure_model_size(original_model)
    comp_size = measure_model_size(compressed_model)
    
    size_reduction = (orig_size['size_mb'] - comp_size['size_mb']) / orig_size['size_mb'] * 100
    param_reduction = (orig_size['total_params'] - comp_size['total_params']) / orig_size['total_params'] * 100
    
    print(f"\nSize reduction: {size_reduction:.1f}%")
    print(f"Parameter reduction: {param_reduction:.1f}%")
    
    # 속도 비교
    print("\n--- Inference Speed Comparison ---")
    print("Original model:")
    orig_speed = measure_inference_speed(original_model, test_inputs)
    
    print("\nCompressed model:")
    comp_speed = measure_inference_speed(compressed_model, test_inputs)
    
    speedup = orig_speed['avg_time'] / comp_speed['avg_time']
    print(f"\nSpeed improvement: {speedup:.2f}x")
    
    # 메모리 사용량 비교
    print("\n--- Memory Usage Comparison ---")
    print("Original model:")
    orig_memory = measure_memory_usage(original_model, test_inputs)
    
    print("\nCompressed model:")
    comp_memory = measure_memory_usage(compressed_model, test_inputs)
    
    comparison_results = {
        'size_reduction': size_reduction,
        'param_reduction': param_reduction,
        'speedup': speedup,
        'original': {
            'size': orig_size,
            'speed': orig_speed,
            'memory': orig_memory
        },
        'compressed': {
            'size': comp_size,
            'speed': comp_speed,
            'memory': comp_memory
        }
    }
    
    return comparison_results

def prepare_test_inputs(tokenizer):
    """테스트용 입력 데이터 준비"""
    test_texts = [
        "This is a test sentence for performance measurement.",
        "Model compression reduces size while maintaining accuracy.",
        "Artificial intelligence enables automated optimization."
    ]
    
    # 평균 길이 계산을 위해 모든 텍스트 토크나이즈
    sample_text = test_texts[0]  # 첫 번째 텍스트로 대표
    inputs = tokenizer(sample_text, return_tensors="pt", padding=True, truncation=True)
    
    return inputs

def run_compression_test(model_name, compression_type, **kwargs):
    """압축 테스트 실행"""
    print(f"\n=== Model Compression Test ===")
    print(f"Model: {model_name}")
    print(f"Compression: {compression_type}")
    
    # 모델 로드
    model, tokenizer = load_model(model_name)
    if model is None:
        return
    
    # 테스트 입력 준비
    test_inputs = prepare_test_inputs(tokenizer)
    
    # 원본 모델 복사 (비교용)
    original_model = type(model)()
    original_model.load_state_dict(model.state_dict())
    
    # 압축 적용
    print(f"\n--- Applying {compression_type} Compression ---")
    
    if compression_type == "pruning":
        method = kwargs.get("method", "magnitude")
        ratio = kwargs.get("ratio", 0.3)
        compressed_model = compress_model(model, method="pruning", 
                                        pruning_method=method, ratio=ratio)
    
    elif compression_type == "quantization":
        method = kwargs.get("method", "dynamic")
        bits = kwargs.get("bits", 8)
        compressed_model = compress_model(model, method="quantization", 
                                        quant_method=method, bits=bits)
    
    elif compression_type == "distillation":
        method = kwargs.get("method", "standard")
        compressed_model = compress_model(model, method="distillation", 
                                        distill_method=method)
    
    else:
        print(f"Unknown compression type: {compression_type}")
        return
    
    # 모델 비교 수행
    results = compare_models(original_model, compressed_model, test_inputs)
    
    # 결과 저장
    save_results(model_name, compression_type, results, **kwargs)
    
    return results

def save_results(model_name, compression_type, results, **kwargs):
    """결과 저장"""
    results_dir = create_results_dir()
    timestamp = time.strftime("%Y%m%d_%H%M%S")
    result_file = results_dir / f"compression_test_{timestamp}.txt"
    
    with open(result_file, "w") as f:
        f.write(f"Model Compression Test Results\n")
        f.write(f"==============================\n")
        f.write(f"Model: {model_name}\n")
        f.write(f"Compression: {compression_type}\n")
        
        if compression_type == "pruning":
            f.write(f"Pruning ratio: {kwargs.get('ratio', 0.3)}\n")
        elif compression_type == "quantization":
            f.write(f"Quantization bits: {kwargs.get('bits', 8)}\n")
        
        f.write(f"\nResults:\n")
        f.write(f"Size reduction: {results['size_reduction']:.1f}%\n")
        f.write(f"Parameter reduction: {results['param_reduction']:.1f}%\n")
        f.write(f"Speed improvement: {results['speedup']:.2f}x\n")
        
        # 상세 정보
        f.write(f"\nDetailed Metrics:\n")
        f.write(f"Original size: {results['original']['size']['size_mb']:.2f} MB\n")
        f.write(f"Compressed size: {results['compressed']['size']['size_mb']:.2f} MB\n")
        f.write(f"Original inference time: {results['original']['speed']['avg_time']*1000:.2f} ms\n")
        f.write(f"Compressed inference time: {results['compressed']['speed']['avg_time']*1000:.2f} ms\n")
    
    print(f"Results saved to: {result_file}")

def main():
    parser = argparse.ArgumentParser(description="Model Compression Test System")
    parser.add_argument("--model", default="distilbert-base-uncased", 
                       help="Model name to compress")
    parser.add_argument("--compression", choices=["pruning", "quantization", "distillation"], 
                       default="pruning", help="Compression method")
    parser.add_argument("--method", default="magnitude", 
                       help="Specific method (e.g., magnitude for pruning, dynamic for quantization)")
    parser.add_argument("--ratio", type=float, default=0.3, 
                       help="Pruning ratio (0.0-1.0)")
    parser.add_argument("--bits", type=int, default=8, 
                       help="Quantization bits")
    
    args = parser.parse_args()
    
    # 압축 테스트 실행
    results = run_compression_test(
        args.model, 
        args.compression, 
        method=args.method,
        ratio=args.ratio,
        bits=args.bits
    )
    
    if results:
        print(f"\n=== Final Summary ===")
        print(f"Compression achieved: {results['size_reduction']:.1f}% size reduction")
        print(f"Speed improvement: {results['speedup']:.2f}x faster")
        print(f"Parameter reduction: {results['param_reduction']:.1f}%")

if __name__ == "__main__":
    main()