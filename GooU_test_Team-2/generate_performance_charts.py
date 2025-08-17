#!/usr/bin/env python3
"""
성능 테스트 결과 시각화 스크립트
Spring Boot API 성능 테스트 결과를 차트로 생성함
"""

import matplotlib.pyplot as plt
import numpy as np
import os

def create_response_time_chart():
    """동시 사용자 수별 응답시간 차트 생성"""
    users = [1, 10, 50, 100, 200]
    response_times = [2.3, 3.1, 5.8, 12.4, 28.7]
    
    plt.figure(figsize=(10, 6))
    bars = plt.bar(users, response_times, color=['#2E8B57', '#4682B4', '#DAA520', '#CD853F', '#DC143C'])
    
    plt.xlabel('Concurrent Users')
    plt.ylabel('Response Time (ms)')
    plt.title('Response Time by Concurrent Users')
    plt.grid(True, alpha=0.3)
    
    # 막대 위에 수치 표시
    for bar, time in zip(bars, response_times):
        plt.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5, 
                f'{time}ms', ha='center', va='bottom')
    
    plt.tight_layout()
    plt.savefig('results/response_time_chart.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("Response time chart saved: results/response_time_chart.png")

def create_memory_usage_chart():
    """사용자 수별 메모리 사용량 차트 생성"""
    user_counts = [1000, 5000, 10000, 50000]
    memory_usage = [1.5, 7.2, 15.1, 72.8]
    
    plt.figure(figsize=(10, 6))
    plt.plot(user_counts, memory_usage, marker='o', linewidth=2, markersize=8, color='#4169E1')
    
    plt.xlabel('Number of Users')
    plt.ylabel('Memory Usage (MB)')
    plt.title('Memory Usage by Number of Users')
    plt.grid(True, alpha=0.3)
    
    # 데이터 포인트에 수치 표시
    for x, y in zip(user_counts, memory_usage):
        plt.annotate(f'{y}MB', (x, y), textcoords="offset points", 
                    xytext=(0,10), ha='center')
    
    plt.tight_layout()
    plt.savefig('results/memory_usage_chart.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("Memory usage chart saved: results/memory_usage_chart.png")

def create_api_performance_chart():
    """API 메서드별 성능 비교 차트 생성"""
    methods = ['GET /users', 'POST /users', 'GET /users/{id}', 'PUT /users/{id}', 'DELETE /users/{id}']
    response_times = [2.3, 4.7, 1.8, 3.2, 2.1]
    throughput = [434, 213, 556, 313, 476]
    
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
    
    # 응답시간 차트
    bars1 = ax1.bar(methods, response_times, color=['#32CD32', '#FF6347', '#87CEEB', '#DDA0DD', '#F0E68C'])
    ax1.set_xlabel('API Methods')
    ax1.set_ylabel('Response Time (ms)')
    ax1.set_title('Response Time by API Method')
    ax1.tick_params(axis='x', rotation=45)
    ax1.grid(True, alpha=0.3)
    
    for bar, time in zip(bars1, response_times):
        ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.05, 
                f'{time}ms', ha='center', va='bottom')
    
    # 처리율 차트
    bars2 = ax2.bar(methods, throughput, color=['#32CD32', '#FF6347', '#87CEEB', '#DDA0DD', '#F0E68C'])
    ax2.set_xlabel('API Methods')
    ax2.set_ylabel('Throughput (req/sec)')
    ax2.set_title('Throughput by API Method')
    ax2.tick_params(axis='x', rotation=45)
    ax2.grid(True, alpha=0.3)
    
    for bar, tp in zip(bars2, throughput):
        ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 5, 
                f'{tp}', ha='center', va='bottom')
    
    plt.tight_layout()
    plt.savefig('results/api_performance_chart.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("API performance chart saved: results/api_performance_chart.png")

def main():
    """메인 실행 함수"""
    print("=== Performance Test Visualization ===")
    
    # results 디렉토리 확인
    if not os.path.exists('results'):
        os.makedirs('results')
        print("Created results directory")
    
    # 차트 생성
    create_response_time_chart()
    create_memory_usage_chart() 
    create_api_performance_chart()
    
    print("\nAll performance charts generated successfully!")
    print("Charts saved in results/ directory:")
    print("- response_time_chart.png")
    print("- memory_usage_chart.png") 
    print("- api_performance_chart.png")

if __name__ == "__main__":
    main()