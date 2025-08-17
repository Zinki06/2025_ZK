"""
L1 x� 0 �t� �1  �� � ܤ\
L1<\ D �X� t� � ޔ MIDI �t�|xD �1\ �,
� ��\ �� �`  �� x0�� ܤ\
"""

import sys
import os
import argparse

def run_gui():
    """GUI ��\ � ܤ\ �"""
    import tkinter as tk
    from src.audio_gui import AudioRecorderGUI
    
    recordings_dir = "audio_recordings"
    os.makedirs(recordings_dir, exist_ok=True)
    
    root = tk.Tk()
    app = AudioRecorderGUI(root)
    
    app.result_text.insert(tk.END, 
        "L1 x� �t� �1 ܤ\\n\n"
        "1. �tl ��<\ L1 yL\n"
        "2. M��\ �X �  �\n"
        "3. � ޔ MIDI �t�|x �1\n"
        "4. � ��\ �� �\n\n"
    )
    
    root.mainloop()

def test_stt():
    """L1-M�� �X L��"""
    print("L1-M�� �X L�� ܑ...")
    from src.main_stt_test import main
    main()

def test_emotion():
    """ � L��"""
    print(" � L�� ܑ...")
    from src.main_emotion_test import main
    main()

def test_gesture():
    """�� x� L��"""
    print("�� x� L�� ܑ...")
    from src.gesture_test import main
    main()

def test_midi():
    """MIDI �% L��"""
    print("MIDI �% L�� ܑ...")
    from src.main_midi_test import main
    main()

def main():
    """Tx h - � ��  �"""
    parser = argparse.ArgumentParser(description="L1 x� �t� �1 ܤ\")
    parser.add_argument('--mode', '-m', 
                      choices=['gui', 'stt', 'emotion', 'gesture', 'midi'],
                      default='gui',
                      help='� ��  � (0�: gui)')
    
    args = parser.parse_args()
    
    mode_functions = {
        'gui': run_gui,
        'stt': test_stt,
        'emotion': test_emotion,
        'gesture': test_gesture,
        'midi': test_midi
    }
    
    try:
        mode_functions[args.mode]()
    except KeyboardInterrupt:
        print("\n\�� ��")
    except Exception as e:
        print(f"$X �: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()