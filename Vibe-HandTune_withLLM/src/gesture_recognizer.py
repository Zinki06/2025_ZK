"""
제스처 인식 모듈 - 웹캠을 통해 손 제스처를 감지하고 관련 데이터를 추출함
"""

import cv2
import mediapipe as mp
import numpy as np
import time
import platform
from typing import Dict, List, Tuple, Optional, Union
from src.config_loader import load_camera_settings

# 전역 변수들
_mp_hands = None
_mp_drawing = None
_mp_drawing_styles = None
_hands = None
_cap = None
_settings = None
_gesture_data = None
_previous_values = {}

def _init_mediapipe():
    """MediaPipe 초기화"""
    global _mp_hands, _mp_drawing, _mp_drawing_styles, _hands
    
    if _mp_hands is None:
        _mp_hands = mp.solutions.hands
        _mp_drawing = mp.solutions.drawing_utils
        _mp_drawing_styles = mp.solutions.drawing_styles

def _init_hands(settings):
    """Hands 객체 초기화"""
    global _hands
    
    if _hands is None:
        _init_mediapipe()
        _hands = _mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=settings["max_hands"],
            min_detection_confidence=settings["min_detection_confidence"],
            min_tracking_confidence=settings["min_tracking_confidence"],
            model_complexity=1
        )

def _reset_gesture_data():
    """제스처 데이터 초기화"""
    global _gesture_data
    
    _gesture_data = {
        'left_hand': {
            'landmarks': None,
            'thumb_index_distance': 0.0,
            'x_position': 0.0,
            'y_position': 0.0,
            'detected': False
        },
        'right_hand': {
            'landmarks': None,
            'thumb_index_distance': 0.0,
            'x_position': 0.0,
            'y_position': 0.0,
            'detected': False
        },
        'hands_distance': 0.0,
        'both_hands_detected': False
    }

def detect_available_cameras():
    """사용 가능한 카메라 목록 감지"""
    available_cameras = []
    for i in range(10):
        cap = cv2.VideoCapture(i)
        if cap.isOpened():
            available_cameras.append(i)
            cap.release()
    return available_cameras

def find_built_in_camera():
    """내장 웹캠 ID 찾기 (macOS 환경 기준)"""
    if platform.system() == 'Darwin':  # macOS
        available_cameras = detect_available_cameras()
        
        if not available_cameras:
            return -1
        
        for camera_id in available_cameras:
            cap = cv2.VideoCapture(camera_id)
            if cap.isOpened():
                if platform.mac_ver()[0]:
                    try:
                        camera_name = cap.getBackendName()
                        if "FaceTime" in camera_name or "Built-in" in camera_name:
                            cap.release()
                            return camera_id
                    except:
                        pass
                cap.release()
        
        return available_cameras[0]
    
    return 0

def init_gesture_recognition(settings_path=None, webcam_id=None, width=None, height=None, flip_horizontal=None):
    """제스처 인식 시스템 초기화"""
    global _settings
    
    # 설정 로드
    _settings = load_camera_settings(settings_path)
    
    # 인자로 받은 값이 있으면 설정 덮어쓰기
    if webcam_id is not None:
        _settings["camera_id"] = webcam_id
    if width is not None:
        _settings["width"] = width
    if height is not None:
        _settings["height"] = height
    if flip_horizontal is not None:
        _settings["flip_horizontal"] = flip_horizontal
    
    # MediaPipe 및 Hands 초기화
    _init_hands(_settings)
    
    # 제스처 데이터 초기화
    _reset_gesture_data()
    
    return _settings

def start_webcam():
    """웹캠 시작"""
    global _cap, _settings
    
    try:
        webcam_id = _settings["camera_id"]
        
        # 자동 감지 모드인 경우
        if webcam_id == -1:
            camera_id = find_built_in_camera()
            if camera_id == -1:
                print("사용 가능한 카메라를 찾을 수 없습니다.")
                camera_id = 0
                print(f"기본 카메라 ID {camera_id}로 시도합니다...")
            else:
                print(f"카메라 ID {camera_id}를 사용합니다.")
            
            _settings["camera_id"] = camera_id
            webcam_id = camera_id
        
        # 카메라 열기
        _cap = cv2.VideoCapture(webcam_id)
        
        # 해상도 설정
        _cap.set(cv2.CAP_PROP_FRAME_WIDTH, _settings["width"])
        _cap.set(cv2.CAP_PROP_FRAME_HEIGHT, _settings["height"])
        
        # 성공적으로 열렸는지 확인
        if not _cap.isOpened():
            print(f"카메라 ID {webcam_id}를 열 수 없습니다.")
            
            # 다른 카메라 자동 시도
            available_cameras = detect_available_cameras()
            for cam_id in available_cameras:
                if cam_id != webcam_id:
                    print(f"카메라 ID {cam_id} 시도 중...")
                    _cap = cv2.VideoCapture(cam_id)
                    _cap.set(cv2.CAP_PROP_FRAME_WIDTH, _settings["width"])
                    _cap.set(cv2.CAP_PROP_FRAME_HEIGHT, _settings["height"])
                    
                    if _cap.isOpened():
                        print(f"카메라 ID {cam_id}를 사용합니다.")
                        _settings["camera_id"] = cam_id
                        ret, _ = _cap.read()
                        if ret:
                            return True
            
            return False
        
        # 테스트 프레임 읽기
        ret, _ = _cap.read()
        return ret
        
    except Exception as e:
        print(f"웹캠 시작 중 오류 발생: {e}")
        return False

def release_webcam():
    """웹캠 리소스 해제"""
    global _cap
    if _cap and _cap.isOpened():
        _cap.release()
    cv2.destroyAllWindows()

def calculate_distance(p1, p2):
    """두 점 사이의 유클리드 거리 계산"""
    return np.linalg.norm(np.array(p1) - np.array(p2))

def smooth_value(key, value):
    """값에 스무딩 적용"""
    global _previous_values, _settings
    
    if not _settings.get("smooth_landmarks", True):
        return value
        
    if key not in _previous_values:
        _previous_values[key] = value
        return value
        
    smooth_factor = 0.8
    smoothed = _previous_values[key] * smooth_factor + value * (1 - smooth_factor)
    _previous_values[key] = smoothed
    
    return smoothed

def process_hand_landmarks(results):
    """MediaPipe 손 랜드마크 결과 처리"""
    global _gesture_data, _settings
    
    # 제스처 데이터 초기화
    _gesture_data['left_hand']['detected'] = False
    _gesture_data['right_hand']['detected'] = False
    _gesture_data['both_hands_detected'] = False
    
    if not results.multi_hand_landmarks:
        return _gesture_data
        
    # 감지된 각 손 처리
    for idx, (hand_landmarks, handedness) in enumerate(
        zip(results.multi_hand_landmarks, results.multi_handedness)
    ):
        hand_label = handedness.classification[0].label
        
        # 좌우반전 적용 여부 확인
        if _settings["flip_horizontal"]:
            hand_type = 'right_hand' if hand_label == 'Left' else 'left_hand'
        else:
            hand_type = 'left_hand' if hand_label == 'Left' else 'right_hand'
            
        # 랜드마크 좌표 추출
        landmarks_list = []
        for landmark in hand_landmarks.landmark:
            landmarks_list.append([landmark.x, landmark.y, landmark.z])
        
        # 손 데이터 업데이트
        _gesture_data[hand_type]['landmarks'] = landmarks_list
        _gesture_data[hand_type]['detected'] = True
        
        # 엄지-검지 사이 거리 계산
        thumb_tip = landmarks_list[4]
        index_tip = landmarks_list[8]
        thumb_index_dist = calculate_distance(thumb_tip, index_tip)
        
        # 손목 위치
        wrist = landmarks_list[0]
        
        # 손 데이터 업데이트 (스무딩 적용)
        _gesture_data[hand_type]['thumb_index_distance'] = smooth_value(f"{hand_type}_thumb_index", thumb_index_dist)
        _gesture_data[hand_type]['x_position'] = smooth_value(f"{hand_type}_x", wrist[0])
        _gesture_data[hand_type]['y_position'] = smooth_value(f"{hand_type}_y", wrist[1])
    
    # 양손 감지 여부 확인
    if _gesture_data['left_hand']['detected'] and _gesture_data['right_hand']['detected']:
        left_wrist = _gesture_data['left_hand']['landmarks'][0]
        right_wrist = _gesture_data['right_hand']['landmarks'][0]
        hands_dist = calculate_distance(left_wrist, right_wrist)
        
        _gesture_data['hands_distance'] = smooth_value("hands_distance", hands_dist)
        _gesture_data['both_hands_detected'] = True
    
    return _gesture_data

def get_hand_landmarks():
    """현재 제스처 데이터 반환"""
    return _gesture_data

def draw_landmarks(image, results):
    """손 랜드마크 시각화"""
    global _mp_drawing, _mp_drawing_styles, _mp_hands
    
    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            _mp_drawing.draw_landmarks(
                image,
                hand_landmarks,
                _mp_hands.HAND_CONNECTIONS,
                _mp_drawing_styles.get_default_hand_landmarks_style(),
                _mp_drawing_styles.get_default_hand_connections_style()
            )

def draw_gesture_data(image):
    """제스처 데이터 텍스트 시각화"""
    global _gesture_data, _settings
    
    # 왼손 정보
    if _gesture_data['left_hand']['detected']:
        left_dist = _gesture_data['left_hand']['thumb_index_distance']
        left_y = _gesture_data['left_hand']['y_position']
        left_x = _gesture_data['left_hand']['x_position']
        
        cv2.putText(image, f"Left Hand:", (10, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)
        cv2.putText(image, f"Thumb-Index: {left_dist:.2f}", (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)
        cv2.putText(image, f"Y-pos: {left_y:.2f}", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)
        cv2.putText(image, f"X-pos: {left_x:.2f}", (10, 80), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)
    
    # 오른손 정보
    if _gesture_data['right_hand']['detected']:
        right_dist = _gesture_data['right_hand']['thumb_index_distance']
        right_y = _gesture_data['right_hand']['y_position']
        right_x = _gesture_data['right_hand']['x_position']
        
        cv2.putText(image, f"Right Hand:", (image.shape[1] - 170, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)
        cv2.putText(image, f"Thumb-Index: {right_dist:.2f}", (image.shape[1] - 170, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)
        cv2.putText(image, f"Y-pos: {right_y:.2f}", (image.shape[1] - 170, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)
        cv2.putText(image, f"X-pos: {right_x:.2f}", (image.shape[1] - 170, 80), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)
    
    # 양손 정보
    if _gesture_data['both_hands_detected']:
        hands_dist = _gesture_data['hands_distance']
        cv2.putText(image, f"Hands Distance: {hands_dist:.2f}", (image.shape[1]//2 - 80, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 1)
    
    # 카메라 ID 및 좌우반전 상태 표시
    flip_status = "On" if _settings["flip_horizontal"] else "Off"
    cv2.putText(image, f"Camera ID: {_settings['camera_id']} | Flip: {flip_status}", 
               (10, image.shape[0] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

def process_frame(frame):
    """단일 프레임 처리"""
    global _hands, _settings
    
    # 좌우반전 적용
    if _settings["flip_horizontal"]:
        frame = cv2.flip(frame, 1)
    
    # 이미지 색상 변환 (BGR -> RGB)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    
    # 이미지 처리
    results = _hands.process(rgb_frame)
    
    # 손 랜드마크 처리
    process_hand_landmarks(results)
    
    # 랜드마크 시각화
    annotated_frame = frame.copy()
    draw_landmarks(annotated_frame, results)
    draw_gesture_data(annotated_frame)
    
    return _gesture_data, annotated_frame

def run_gesture_recognition(show_window=True, callback=None):
    """실시간 웹캠 처리 루프"""
    global _cap
    
    if not start_webcam():
        print("웹캠을 시작할 수 없습니다.")
        print("사용 가능한 카메라:", detect_available_cameras())
        return
    
    try:
        while _cap.isOpened():
            ret, frame = _cap.read()
            if not ret:
                print("프레임 읽기 실패")
                break
            
            # 프레임 처리
            gesture_data, annotated_frame = process_frame(frame)
            
            # 콜백 함수 호출
            if callback:
                callback(gesture_data)
            
            # 결과 표시
            if show_window:
                cv2.imshow('Hand Gesture Recognition', annotated_frame)
            
            # 종료 조건
            if cv2.waitKey(5) & 0xFF == ord('q'):
                break
                
    finally:
        release_webcam()

def test_gesture_recognition():
    """제스처 인식 테스트"""
    print("사용 가능한 카메라:", detect_available_cameras())
    
    settings = init_gesture_recognition()
    print(f"현재 설정: {settings}")
    
    def print_gesture_values(gesture_data):
        if gesture_data['left_hand']['detected']:
            print(f"왼손 엄지-검지 거리: {gesture_data['left_hand']['thumb_index_distance']:.2f}")
        if gesture_data['right_hand']['detected']:
            print(f"오른손 엄지-검지 거리: {gesture_data['right_hand']['thumb_index_distance']:.2f}")
        if gesture_data['both_hands_detected']:
            print(f"양손 간 거리: {gesture_data['hands_distance']:.2f}")
        print("---")
    
    print("제스처 인식을 시작합니다... (종료하려면 'q' 키를 누르세요)")
    run_gesture_recognition(show_window=True, callback=print_gesture_values)

if __name__ == "__main__":
    test_gesture_recognition()