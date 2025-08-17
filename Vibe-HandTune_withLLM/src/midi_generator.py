"""
MIDI 메시지 생성 모듈 - 프리셋 정보를 바탕으로 MIDI 시퀀스 생성
"""

import mido
import time
from typing import List, Dict, Union, Optional

# 음표 이름을 MIDI 노트 번호로 변환하는 딕셔너리
NOTE_TO_MIDI = {
    'C0': 12, 'C#0': 13, 'D0': 14, 'D#0': 15, 'E0': 16, 'F0': 17, 
    'F#0': 18, 'G0': 19, 'G#0': 20, 'A0': 21, 'A#0': 22, 'B0': 23,
    'C1': 24, 'C#1': 25, 'D1': 26, 'D#1': 27, 'E1': 28, 'F1': 29, 
    'F#1': 30, 'G1': 31, 'G#1': 32, 'A1': 33, 'A#1': 34, 'B1': 35,
    'C2': 36, 'C#2': 37, 'D2': 38, 'D#2': 39, 'E2': 40, 'F2': 41, 
    'F#2': 42, 'G2': 43, 'G#2': 44, 'A2': 45, 'A#2': 46, 'B2': 47,
    'C3': 48, 'C#3': 49, 'D3': 50, 'D#3': 51, 'E3': 52, 'F3': 53, 
    'F#3': 54, 'G3': 55, 'G#3': 56, 'A3': 57, 'A#3': 58, 'B3': 59,
    'C4': 60, 'C#4': 61, 'D4': 62, 'D#4': 63, 'E4': 64, 'F4': 65, 
    'F#4': 66, 'G4': 67, 'G#4': 68, 'A4': 69, 'A#4': 70, 'B4': 71,
}

def note_name_to_number(note_name):
    """음표 이름을 MIDI 노트 번호로 변환"""
    if note_name in NOTE_TO_MIDI:
        return NOTE_TO_MIDI[note_name]
    raise ValueError(f"잘못된 음표 이름: {note_name}")

def parse_rhythm(rhythm_pattern):
    """리듬 패턴 문자열을 노트 길이 리스트로 변환"""
    if not rhythm_pattern:
        return [1.0]  # 기본값: 4분음표
        
    parts = rhythm_pattern.split(',')
    note_lengths = []
    
    for part in parts:
        try:
            denominator = int(part.strip())
            if denominator <= 0:
                raise ValueError(f"음표 길이는 양수여야 합니다: {denominator}")
                
            # 4분음표 = 1.0을 기준으로 계산
            length = 4.0 / denominator
            note_lengths.append(length)
        except ValueError:
            # 잘못된 형식은 기본값(4분음표) 사용
            note_lengths.append(1.0)
            
    return note_lengths

def generate_midi_messages(preset, ticks_per_beat=480):
    """
    프리셋을 기반으로 MIDI 메시지 리스트 생성
    
    Args:
        preset: 프리셋 딕셔너리 (tempo, rhythm, notes)
        ticks_per_beat: MIDI 타이밍 해상도
        
    Returns:
        MIDI 메시지 객체 리스트
    """
    messages = []
    
    # 프리셋에서 필요한 정보 추출
    tempo = float(preset.get('tempo', 120))
    rhythm_pattern = str(preset.get('rhythm', '4,4,4,4'))
    notes = preset.get('notes', ['C3', 'E3', 'G3', 'C4'])
    
    # 리듬 패턴 파싱
    note_lengths = parse_rhythm(rhythm_pattern)
    
    # 박자 길이 계산 (초 단위)
    beat_duration = 60.0 / tempo  # 4분음표 길이(초)
    
    # 노트와 리듬 패턴을 조합하여 메시지 생성
    current_time = 0.0
    pattern_length = len(note_lengths)
    
    for i, note_name in enumerate(notes):
        # 현재 노트에 해당하는 리듬 패턴 인덱스
        pattern_idx = i % pattern_length
        note_length = note_lengths[pattern_idx]
        
        # 노트 길이를 초 단위로 변환
        duration = note_length * beat_duration
        
        try:
            # 음표 이름을 MIDI 노트 번호로 변환
            note_number = note_name_to_number(note_name)
            
            # note_on 메시지 생성
            messages.append(mido.Message('note_on', note=note_number, velocity=64, time=current_time))
            
            # note_off 메시지 생성
            messages.append(mido.Message('note_off', note=note_number, velocity=64, time=current_time + duration))
            
            # 다음 노트의 시작 시간 업데이트
            current_time += duration
            
        except ValueError as e:
            print(f"노트 처리 중 오류 발생: {e}")
            continue
    
    return messages

def create_midi_file(preset, filename="output.mid", ticks_per_beat=480):
    """
    프리셋을 기반으로 MIDI 파일 생성
    
    Args:
        preset: 프리셋 딕셔너리
        filename: 출력 파일 이름
        ticks_per_beat: MIDI 타이밍 해상도
        
    Returns:
        생성된 MIDI 파일 경로
    """
    # 새 MIDI 파일 생성
    mid = mido.MidiFile(ticks_per_beat=ticks_per_beat)
    track = mido.MidiTrack()
    mid.tracks.append(track)
    
    # 템포 설정
    tempo = int(preset.get('tempo', 120))
    tempo_msg = mido.MetaMessage('set_tempo', tempo=mido.bpm2tempo(tempo))
    track.append(tempo_msg)
    
    # MIDI 메시지 생성 및 추가
    messages = generate_midi_messages(preset, ticks_per_beat)
    
    # 시간 기반 메시지를 틱 기반으로 변환하여 트랙에 추가
    last_time = 0
    for msg in messages:
        # 델타 타임 계산 (틱 단위)
        delta_ticks = int((msg.time - last_time) * ticks_per_beat)
        
        # 메시지 생성 (delta time 포함)
        new_msg = mido.Message(msg.type, note=msg.note, velocity=msg.velocity, time=delta_ticks)
        track.append(new_msg)
        
        last_time = msg.time
    
    # 파일 저장
    mid.save(filename)
    return filename

def test_midi_generation():
    """MIDI 생성 테스트"""
    # 테스트 프리셋
    test_preset = {
        'tempo': 120,
        'rhythm': '4,8,8,4',
        'notes': ['C3', 'E3', 'G3', 'C4']
    }
    
    print("MIDI 메시지 생성 테스트...")
    messages = generate_midi_messages(test_preset)
    
    for i, msg in enumerate(messages):
        print(f"메시지 {i+1}: {msg}")
    
    print(f"\n총 {len(messages)}개의 MIDI 메시지 생성됨")
    
    # MIDI 파일 생성 테스트
    print("\nMIDI 파일 생성 테스트...")
    filename = create_midi_file(test_preset, "test_output.mid")
    print(f"MIDI 파일 생성 완료: {filename}")

if __name__ == "__main__":
    test_midi_generation() 