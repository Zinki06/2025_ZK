#!/usr/bin/env python3
"""
Model Compression Algorithms
모델 압축 알고리즘 통합 모듈 (Pruning, Quantization, Distillation)
"""

import torch
import torch.nn as nn
import torch.nn.utils.prune as prune
import torch.nn.functional as F
import torch.quantization as quant
import numpy as np

# =============================================================================
# PRUNING ALGORITHMS
# =============================================================================

def magnitude_based_pruning(model, pruning_ratio=0.3):
    """크기 기반 비구조적 가지치기"""
    pruned_params = 0
    total_params = 0
    
    for name, module in model.named_modules():
        if isinstance(module, (nn.Linear, nn.Conv2d)):
            if hasattr(module, 'weight') and module.weight is not None:
                # L1 magnitude-based pruning
                prune.l1_unstructured(module, name='weight', amount=pruning_ratio)
                
                pruned_count = int(pruning_ratio * module.weight.numel())
                pruned_params += pruned_count
                total_params += module.weight.numel()
    
    print(f"Magnitude pruning: {pruned_params:,} / {total_params:,} params removed")
    return model

def structured_channel_pruning(model, pruning_ratio=0.2):
    """채널 단위 구조적 가지치기"""
    for name, module in model.named_modules():
        if isinstance(module, nn.Linear):
            if hasattr(module, 'weight') and module.weight is not None:
                # 출력 채널별 L2 norm 계산
                channel_norms = torch.norm(module.weight, dim=1)
                
                # 하위 X% 채널 제거
                num_channels = len(channel_norms)
                num_prune = int(num_channels * pruning_ratio)
                
                if num_prune > 0:
                    _, indices = torch.topk(channel_norms, num_prune, largest=False)
                    
                    # 구조적 pruning (실제로는 mask 적용)
                    mask = torch.ones_like(module.weight)
                    mask[indices] = 0
                    
                    prune.custom_from_mask(module, name='weight', mask=mask)
    
    print(f"Structured channel pruning applied with ratio: {pruning_ratio}")
    return model

def calculate_sparsity(model):
    """모델의 희소성(sparsity) 분석"""
    total_params = 0
    zero_params = 0
    
    for name, param in model.named_parameters():
        if 'weight' in name:
            total_params += param.numel()
            zero_params += (param == 0).sum().item()
    
    sparsity = zero_params / total_params * 100
    print(f"Model sparsity: {sparsity:.2f}% ({zero_params:,} / {total_params:,})")
    return sparsity

def prune_model(model, method="magnitude", **kwargs):
    """통합 pruning 함수"""
    print(f"Applying {method} pruning...")
    
    if method == "magnitude":
        ratio = kwargs.get("ratio", 0.3)
        return magnitude_based_pruning(model, ratio)
    
    elif method == "structured":
        ratio = kwargs.get("ratio", 0.2)
        return structured_channel_pruning(model, ratio)
    
    else:
        print(f"Unknown pruning method: {method}")
        return model

# =============================================================================
# QUANTIZATION ALGORITHMS
# =============================================================================

def dynamic_quantization(model, dtype=torch.qint8):
    """동적 양자화 적용"""
    print(f"Applying dynamic quantization with dtype: {dtype}")
    
    # Linear layer에 대해 동적 양자화 적용
    quantized_model = quant.quantize_dynamic(
        model, 
        {nn.Linear}, 
        dtype=dtype
    )
    
    return quantized_model

def weight_only_quantization(model, bits=4):
    """가중치 전용 양자화 (INT4/INT8)"""
    print(f"Applying {bits}-bit weight-only quantization...")
    
    total_params = 0
    compressed_params = 0
    
    for name, param in model.named_parameters():
        if 'weight' in name and param.dim() > 1:
            original_size = param.numel() * 32  # 32-bit float
            
            # 가중치 양자화
            weight_min = param.min()
            weight_max = param.max()
            
            # 양자화 레벨
            q_levels = 2**bits - 1
            scale = (weight_max - weight_min) / q_levels
            
            # 양자화 적용
            quantized_weight = torch.round((param - weight_min) / scale)
            quantized_weight = torch.clamp(quantized_weight, 0, q_levels)
            
            # 역양자화 (실제 사용 시)
            dequantized_weight = quantized_weight * scale + weight_min
            param.data = dequantized_weight
            
            compressed_size = param.numel() * bits
            total_params += original_size
            compressed_params += compressed_size
    
    compression_ratio = (total_params - compressed_params) / total_params * 100
    print(f"Weight compression ratio: {compression_ratio:.1f}%")
    
    return model

def quantize_model(model, method="dynamic", **kwargs):
    """통합 양자화 함수"""
    print(f"Applying {method} quantization...")
    
    if method == "dynamic":
        dtype = kwargs.get("dtype", torch.qint8)
        return dynamic_quantization(model, dtype)
    
    elif method == "weight_only":
        bits = kwargs.get("bits", 8)
        return weight_only_quantization(model, bits)
    
    else:
        print(f"Unknown quantization method: {method}")
        return model

def estimate_model_size(model, bits=32):
    """모델 크기 추정 (비트 단위)"""
    total_params = sum(p.numel() for p in model.parameters())
    size_bits = total_params * bits
    size_mb = size_bits / (8 * 1024 * 1024)
    
    print(f"Model size: {total_params:,} params, {size_mb:.2f} MB ({bits}-bit)")
    return size_mb

# =============================================================================
# KNOWLEDGE DISTILLATION
# =============================================================================

def knowledge_distillation_loss(student_outputs, teacher_outputs, labels=None, 
                              temperature=4.0, alpha=0.7):
    """지식 증류 손실 함수"""
    
    # Soft target loss (teacher의 지식 전달)
    soft_loss = F.kl_div(
        F.log_softmax(student_outputs / temperature, dim=-1),
        F.softmax(teacher_outputs / temperature, dim=-1),
        reduction='batchmean'
    ) * (temperature ** 2)
    
    # Hard target loss (실제 라벨)
    if labels is not None:
        hard_loss = F.cross_entropy(student_outputs, labels)
        total_loss = alpha * soft_loss + (1 - alpha) * hard_loss
    else:
        total_loss = soft_loss
    
    return total_loss, soft_loss.item()

def feature_matching_loss(student_features, teacher_features):
    """특성 매칭 손실 (중간 레이어 feature alignment)"""
    if len(student_features) != len(teacher_features):
        print("Warning: Feature dimension mismatch")
        return torch.tensor(0.0)
    
    total_loss = 0
    for s_feat, t_feat in zip(student_features, teacher_features):
        # 차원이 다르면 적응 레이어 필요
        if s_feat.shape != t_feat.shape:
            # 간단한 평균 풀링으로 차원 맞춤
            if s_feat.size(-1) < t_feat.size(-1):
                t_feat = F.adaptive_avg_pool1d(t_feat.transpose(-1, -2), s_feat.size(-1)).transpose(-1, -2)
            else:
                s_feat = F.adaptive_avg_pool1d(s_feat.transpose(-1, -2), t_feat.size(-1)).transpose(-1, -2)
        
        # MSE loss for feature matching
        loss = F.mse_loss(s_feat, t_feat)
        total_loss += loss
    
    return total_loss / len(student_features)

def progressive_distillation(teacher_model, student_model, train_data, 
                           num_stages=3, epochs_per_stage=10):
    """점진적 지식 증류"""
    print(f"Starting progressive distillation with {num_stages} stages...")
    
    # 각 단계별로 다른 temperature와 alpha 사용
    temperatures = [8.0, 6.0, 4.0]
    alphas = [0.9, 0.8, 0.7]
    
    optimizer = torch.optim.Adam(student_model.parameters(), lr=1e-4)
    
    for stage in range(num_stages):
        temp = temperatures[stage] if stage < len(temperatures) else 4.0
        alpha = alphas[stage] if stage < len(alphas) else 0.7
        
        print(f"Stage {stage + 1}/{num_stages}: T={temp}, α={alpha}")
        
        for epoch in range(epochs_per_stage):
            total_loss = 0
            num_batches = 0
            
            for batch_data in train_data:
                optimizer.zero_grad()
                
                # Teacher forward (no grad)
                with torch.no_grad():
                    teacher_outputs = teacher_model(batch_data)
                
                # Student forward
                student_outputs = student_model(batch_data)
                
                # Distillation loss
                loss, soft_loss = knowledge_distillation_loss(
                    student_outputs, teacher_outputs, 
                    temperature=temp, alpha=alpha
                )
                
                loss.backward()
                optimizer.step()
                
                total_loss += loss.item()
                num_batches += 1
            
            avg_loss = total_loss / num_batches if num_batches > 0 else 0
            if epoch % 5 == 0:
                print(f"  Epoch {epoch + 1}: Loss = {avg_loss:.4f}")
    
    print("Progressive distillation completed")
    return student_model

def distill_model(teacher_model, method="standard", **kwargs):
    """통합 지식 증류 함수"""
    print(f"Applying {method} knowledge distillation...")
    
    train_data = kwargs.get("train_data", [])
    
    if method == "standard":
        student_model = kwargs.get("student_model")
        if student_model is None:
            print("Error: Student model required for standard distillation")
            return None
        
        return progressive_distillation(teacher_model, student_model, train_data)
    
    else:
        print(f"Unknown distillation method: {method}")
        return teacher_model

# =============================================================================
# UNIFIED COMPRESSION INTERFACE
# =============================================================================

def compress_model(model, method="pruning", **kwargs):
    """통합 압축 인터페이스"""
    print(f"Applying {method} compression to model...")
    
    if method == "pruning":
        pruning_method = kwargs.get("pruning_method", "magnitude")
        ratio = kwargs.get("ratio", 0.3)
        return prune_model(model, method=pruning_method, ratio=ratio)
    
    elif method == "quantization":
        quant_method = kwargs.get("quant_method", "dynamic")
        bits = kwargs.get("bits", 8)
        return quantize_model(model, method=quant_method, bits=bits)
    
    elif method == "distillation":
        distill_method = kwargs.get("distill_method", "standard")
        student_model = kwargs.get("student_model")
        train_data = kwargs.get("train_data", [])
        return distill_model(model, method=distill_method, 
                           student_model=student_model, train_data=train_data)
    
    else:
        print(f"Unknown compression method: {method}")
        return model

# =============================================================================
# ANALYSIS FUNCTIONS
# =============================================================================

def analyze_compression_results(original_model, compressed_model):
    """압축 결과 분석"""
    print("Analyzing compression results...")
    
    # 파라미터 수 비교
    orig_params = sum(p.numel() for p in original_model.parameters())
    comp_params = sum(p.numel() for p in compressed_model.parameters())
    
    param_reduction = (orig_params - comp_params) / orig_params * 100
    
    # 모델 크기 비교
    orig_size = estimate_model_size(original_model, bits=32)
    comp_size = estimate_model_size(compressed_model, bits=32)
    
    size_reduction = (orig_size - comp_size) / orig_size * 100
    
    print(f"Parameter reduction: {param_reduction:.1f}%")
    print(f"Model size reduction: {size_reduction:.1f}%")
    
    return {
        'param_reduction': param_reduction,
        'size_reduction': size_reduction,
        'original_params': orig_params,
        'compressed_params': comp_params
    }