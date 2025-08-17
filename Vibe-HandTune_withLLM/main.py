"""
L1 x› 0 †t§ ›1  §ò ¥ ‹§\
L1<\ D ÑX‡ t˘ – ﬁî MIDI †t§|xD ›1\ ƒ,
ê §ò\ ‰‹ ¥`  àî x0ô ‹§\
"""

import sys
import os
import argparse

def run_gui():
    """GUI ®‹\ ¥ ‹§\ ‰â"""
    import tkinter as tk
    from src.audio_gui import AudioRecorderGUI
    
    recordings_dir = "audio_recordings"
    os.makedirs(recordings_dir, exist_ok=True)
    
    root = tk.Tk()
    app = AudioRecorderGUI(root)
    
    app.result_text.insert(tk.END, 
        "L1 x› †t§ ›1 ‹§\\n\n"
        "1. »tl Ñº<\ L1 yL\n"
        "2. M§∏\ ¿X ƒ  Ñ\n"
        "3. – ﬁî MIDI †t§|x ›1\n"
        "4. ê §ò\ ‰‹ ¥\n\n"
    )
    
    root.mainloop()

def test_stt():
    """L1-M§∏ ¿X L§∏"""
    print("L1-M§∏ ¿X L§∏ ‹ë...")
    from src.main_stt_test import main
    main()

def test_emotion():
    """ Ñ L§∏"""
    print(" Ñ L§∏ ‹ë...")
    from src.main_emotion_test import main
    main()

def test_gesture():
    """§ò x› L§∏"""
    print("§ò x› L§∏ ‹ë...")
    from src.gesture_test import main
    main()

def test_midi():
    """MIDI ú% L§∏"""
    print("MIDI ú% L§∏ ‹ë...")
    from src.main_midi_test import main
    main()

def main():
    """Tx h - ‰â ®‹  ›"""
    parser = argparse.ArgumentParser(description="L1 x› †t§ ›1 ‹§\")
    parser.add_argument('--mode', '-m', 
                      choices=['gui', 'stt', 'emotion', 'gesture', 'midi'],
                      default='gui',
                      help='‰â ®‹  › (0¯: gui)')
    
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
        print("\n\¯® ÖÃ")
    except Exception as e:
        print(f"$X ›: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()