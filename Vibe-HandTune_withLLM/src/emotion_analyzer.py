"""
텍스트 기반 감정 분석 모듈
OpenAI GPT-4o API를 사용하여 텍스트에서 감정을 분석하고 1~5 사이의 숫자로 분류함
"""

import os
import re
from openai import OpenAI
from src.config_loader import load_api_key

# 감정 매핑 상수
EMOTION_MAP = {
    "1": "슬픔",
    "2": "평온",
    "3": "중립",
    "4": "행복",
    "5": "흥분"
}

# 전역 클라이언트 변수
_client = None

def _get_client():
    """OpenAI 클라이언트 초기화 및 반환"""
    global _client
    if _client is None:
        api_key = load_api_key()
        _client = OpenAI(api_key=api_key)
    return _client

def _create_emotion_prompt(text):
    """감정 분석을 위한 프롬프트 생성"""
    system_message = """당신은 감정 분석 전문가입니다. 
입력된 텍스트에서 표현된 감정을 아래 다섯 가지 중 하나로 분류하고, 
해당 감정에 대응되는 숫자만 응답해야 합니다. 다른 설명이나 텍스트는 추가하지 마세요.

1: 슬픔 - 우울함, 슬픔, 상실감, 절망
2: 평온 - 안정, 차분함, 평화로움
3: 중립 - 감정이 없거나 중립적, 일상적
4: 행복 - 기쁨, 즐거움, 만족감
5: 흥분 - 열정, 활기참, 에너지, 격앙됨

숫자만 답변하세요. 1, 2, 3, 4, 5 중에서만 응답하세요."""

    user_message = f"다음 텍스트의 감정을 분석해주세요: {text}"
    
    return [
        {"role": "system", "content": system_message},
        {"role": "user", "content": user_message}
    ]

def _validate_response(response):
    """API 응답에서 유효한 감정 번호 추출"""
    match = re.search(r'[1-5]', response)
    
    if match:
        return int(match.group(0))
    else:
        print(f"유효하지 않은 응답: {response}")
        return 3  # 기본값: 중립

def analyze_emotion(text, model="gpt-4o-mini", temperature=0.2):
    """
    텍스트에서 감정을 분석하여 1~5 사이의 숫자로 반환
    
    Args:
        text: 분석할 텍스트
        model: 사용할 OpenAI 모델 이름
        temperature: 모델의 온도 값 (0~1)
        
    Returns:
        int: 감정 번호 (1~5)
    """
    if not text or not isinstance(text, str):
        print("텍스트가 유효하지 않습니다.")
        return 3
    
    text = text.strip()
    if not text:
        print("빈 텍스트입니다.")
        return 3
    
    try:
        client = _get_client()
        messages = _create_emotion_prompt(text)
        
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,
            max_tokens=10
        )
        
        result = response.choices[0].message.content.strip()
        return _validate_response(result)
        
    except Exception as e:
        print(f"감정 분석 중 오류 발생: {str(e)}")
        return 3

def get_emotion_name(emotion_number):
    """감정 번호에 해당하는 감정 이름 반환"""
    emotion_key = str(emotion_number)
    return EMOTION_MAP.get(emotion_key, "중립")

# 테스트 함수
def test_emotion_analysis():
    """감정 분석 테스트"""
    test_texts = [
        "오늘은 정말 슬프고 우울한 하루였어...",
        "평화롭고 고요한 밤이야.",
        "그냥 보통 하루였어. 특별한 일은 없었어.",
        "와! 정말 즐겁고 신나는 여행이었어!",
        "너무 흥분되고 열정적인 공연이었다!"
    ]
    
    for text in test_texts:
        emotion_number = analyze_emotion(text)
        emotion_name = get_emotion_name(emotion_number)
        
        print(f"\n텍스트: \"{text}\"")
        print(f"감정 번호: {emotion_number}")
        print(f"감정 이름: {emotion_name}")

if __name__ == "__main__":
    test_emotion_analysis() 