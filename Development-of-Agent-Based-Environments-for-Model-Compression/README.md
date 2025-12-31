# Transformer Model Compression Toolkit

A lightweight Python toolkit for compressing Transformer models (e.g., BERT, DistilBERT) using standard techniques like Pruning, Quantization, and Knowledge Distillation.

## Features

- **Pruning**: Magnitude-based and Structured Channel Pruning.
- **Quantization**: Dynamic Quantization (INT8) and Weight-only Quantization (INT4/INT8).
- **Distillation**: Progressive Knowledge Distillation support.
- **Analysis**: Built-in tools to measure model size, parameter count, and inference speed.

## Prerequisites

- Python 3.8+
- PyTorch
- Transformers

```bash
pip install torch transformers numpy psutil
```

## Usage

### 1. Run Dynamic Quantization
Quantizes Linear layers to INT8.
```bash
python main.py --model distilbert-base-uncased --compression quantization --method dynamic
```

### 2. Run Pruning
Prunes 30% of weights using magnitude-based pruning.
```bash
python main.py --model distilbert-base-uncased --compression pruning --ratio 0.3
```

### 3. Run Benchmark
The script automatically measures and prints:
- Original vs Compressed Model Size
- Parameter Reduction
- Inference Speed Improvement (Speedup)
