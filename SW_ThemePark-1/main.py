import os
import io
import threading
import sys
import ctypes
from ctypes import util

# --- ALSA Error Suppression (Linux) ---
# PyAudio often prints annoying text to stderr on Linux. This suppresses it.
try:
    asound_lib_name = util.find_library('asound')
    if asound_lib_name:
        asound = ctypes.cdll.LoadLibrary(asound_lib_name)
        # C-type for the error handler
        ERROR_HANDLER_FUNC = ctypes.CFUNCTYPE(None, ctypes.c_char_p, ctypes.c_int, ctypes.c_char_p, ctypes.c_int, ctypes.c_char_p)
        def py_error_handler(filename, line, function, err, fmt):
            pass
        c_error_handler = ERROR_HANDLER_FUNC(py_error_handler)
        asound.snd_lib_error_set_handler(c_error_handler)
except Exception:
    pass # If we can't suppress, we just live with the noise.

import customtkinter as ctk
from tkinter import messagebox
from PIL import Image, ImageTk
import speech_recognition as sr
from dotenv import load_dotenv
from google import genai
from google.genai import types as genai_types

# Load environment variables
load_dotenv()

# Configuration
THEME_COLORS = {
    "primary": "#8FB8DE",       # Soft Pastel Blue
    "secondary": "#9A8FDE",     # Soft Pastel Purple
    "accent": "#DE8FA5",        # Soft Pastel Pink
    "background": "#FDF6F8",    # Very light pinkish white
    "panel": "#FFFFFF",         # White
    "text": "#555555",          # Dark Gray for text
    "text_light": "#FFFFFF"     # White text
}

FONTS = {
    "header": ("Malgun Gothic", 24, "bold"),
    "subheader": ("Malgun Gothic", 16, "bold"),
    "body": ("Malgun Gothic", 14),
    "button": ("Malgun Gothic", 15, "bold")
}

class PictureDiaryApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        # Basic Window Setup
        self.title("AI 그림일기 체험")
        self.geometry("1200x800")
        ctk.set_appearance_mode("light")
        self.configure(fg_color=THEME_COLORS["background"])

        # API Setup
        self.gemini_key = os.getenv("GEMINI_API_KEY")
        self.client = None
        if self.gemini_key:
            try:
                self.client = genai.Client(api_key=self.gemini_key)
            except Exception as e:
                print(f"API Init Error: {e}")

        # State
        self.gender_var = ctk.StringVar(value="남자")
        self.is_processing = False

        # Build UI
        self.setup_ui()

    def setup_ui(self):
        """Builds the main UI layout"""
        # Main Container with padding
        self.main_container = ctk.CTkFrame(self, fg_color="transparent")
        self.main_container.pack(fill="both", expand=True, padx=40, pady=40)

        # Header
        self.header_frame = ctk.CTkFrame(self.main_container, fg_color="transparent")
        self.header_frame.pack(fill="x", pady=(0, 20))
        
        self.title_label = ctk.CTkLabel(
            self.header_frame, 
            text="✨ AI 그림일기 스튜디오 ✨", 
            font=FONTS["header"],
            text_color=THEME_COLORS["secondary"]
        )
        self.title_label.pack()

        # Content Area (Split Left/Right)
        self.content_area = ctk.CTkFrame(self.main_container, fg_color="transparent")
        self.content_area.pack(fill="both", expand=True)
        
        self.content_area.grid_columnconfigure(0, weight=1)
        self.content_area.grid_columnconfigure(1, weight=1)

        # Left Panel (Input)
        self.create_left_panel()

        # Right Panel (Output)
        self.create_right_panel()

    def create_left_panel(self):
        self.left_panel = ctk.CTkFrame(self.content_area, fg_color=THEME_COLORS["panel"], corner_radius=20)
        self.left_panel.grid(row=0, column=0, sticky="nsew", padx=(0, 20))
        
        # Inner Padding Layer
        inner = ctk.CTkFrame(self.left_panel, fg_color="transparent")
        inner.pack(fill="both", expand=True, padx=30, pady=30)

        # Instruction
        ctk.CTkLabel(inner, text="1. 오늘의 이야기를 들려주세요", font=FONTS["subheader"], text_color=THEME_COLORS["text"]).pack(anchor="w", pady=(0, 10))

        # Text Input
        self.input_text = ctk.CTkTextbox(
            inner, 
            height=200, 
            font=FONTS["body"], 
            fg_color="#F8F9FA", 
            border_width=1, 
            border_color="#E0E0E0",
            text_color="#333333"
        )
        self.input_text.pack(fill="x", pady=(0, 20))

        # Options
        ctk.CTkLabel(inner, text="2. 주인공 설정", font=FONTS["subheader"], text_color=THEME_COLORS["text"]).pack(anchor="w", pady=(0, 10))
        
        gender_frame = ctk.CTkFrame(inner, fg_color="transparent")
        gender_frame.pack(fill="x", pady=(0, 20))
        
        ctk.CTkRadioButton(gender_frame, text="남자 아이", variable=self.gender_var, value="남자", font=FONTS["body"],
                           fg_color=THEME_COLORS["primary"], text_color=THEME_COLORS["text"]).pack(side="left", padx=(0, 20))
        ctk.CTkRadioButton(gender_frame, text="여자 아이", variable=self.gender_var, value="여자", font=FONTS["body"],
                           fg_color=THEME_COLORS["accent"], text_color=THEME_COLORS["text"]).pack(side="left")

        # Buttons
        ctk.CTkLabel(inner, text="3. 마법 부리기", font=FONTS["subheader"], text_color=THEME_COLORS["text"]).pack(anchor="w", pady=(0, 10))
        
        self.btn_speech = ctk.CTkButton(
            inner, text="🎤 말로 입력하기", 
            command=self.start_speech_recognition,
            font=FONTS["button"],
            fg_color=THEME_COLORS["secondary"], hover_color=THEME_COLORS["primary"],
            height=50
        )
        self.btn_speech.pack(fill="x", pady=(0, 10))

        self.btn_generate = ctk.CTkButton(
            inner, text="🎨 그림일기 만들기", 
            command=self.start_generation,
            font=FONTS["button"],
            fg_color=THEME_COLORS["primary"], hover_color=THEME_COLORS["secondary"],
            height=50
        )
        self.btn_generate.pack(fill="x")

    def create_right_panel(self):
        self.right_panel = ctk.CTkFrame(self.content_area, fg_color=THEME_COLORS["panel"], corner_radius=20)
        self.right_panel.grid(row=0, column=1, sticky="nsew", padx=(20, 0))

        # Inner Padding Layer
        inner = ctk.CTkFrame(self.right_panel, fg_color="transparent")
        inner.pack(fill="both", expand=True, padx=30, pady=30)

        # Image Display Area
        self.image_display = ctk.CTkLabel(
            inner, 
            text="그림이 여기에 나타나요!", 
            font=FONTS["body"], 
            fg_color="#F0F0F0", 
            corner_radius=15
        )
        self.image_display.pack(fill="both", expand=True, pady=(0, 20))

        # Diary Text Output
        self.output_text = ctk.CTkTextbox(
            inner, 
            height=150, 
            font=("Handon3gyeopsal300g", 16) if "Handon3gyeopsal300g" in os.getenv("FONTS", "") else FONTS["body"], # Fallback
            fg_color="#FDF6F8", 
            border_width=0, 
            text_color="#333333",
            activate_scrollbars=True
        )
        self.output_text.pack(fill="x")
        self.output_text.insert("1.0", "AI가 작성한 일기 내용이 여기에 표시됩니다.")
        self.output_text.configure(state="disabled")

    def start_speech_recognition(self):
        threading.Thread(target=self._run_stt, daemon=True).start()

    def _run_stt(self):
        recognizer = sr.Recognizer()
        try:
            # First check if we can even access a microphone
            # This 'with' block is where ALSA errors usually happen if probed
            with sr.Microphone() as source:
                self.after(0, lambda: self.btn_speech.configure(text="👂 듣고 있어요...", state="disabled"))
                audio = recognizer.listen(source, timeout=5)
                
            text = recognizer.recognize_google(audio, language="ko-KR")
            self.after(0, lambda: self._update_input_text(text))
            
        except OSError as e:
            print(f"STT Device Error: {e}")
            self.after(0, lambda: messagebox.showwarning("마이크 없음", "마이크를 찾을 수 없습니다. 텍스트로 입력해주세요."))
        except Exception as e:
            print(f"STT Error: {e}")
            self.after(0, lambda: messagebox.showerror("오류", "음성 인식에 실패했습니다. (마이크 연결을 확인하세요)"))
        finally:
             self.after(0, lambda: self.btn_speech.configure(text="🎤 말로 입력하기", state="normal"))
    
    def _update_input_text(self, text):
        self.input_text.delete("1.0", "end")
        self.input_text.insert("1.0", text)

    def start_generation(self):
        if self.is_processing: return
        
        text = self.input_text.get("1.0", "end").strip()
        if not text:
            messagebox.showwarning("입력 필요", "일기 내용을 적거나 말해주세요!")
            return

        if not self.client:
             messagebox.showerror("API 오류", "Gemini API 키가 설정되지 않았습니다.")
             return

        self.is_processing = True
        self.btn_generate.configure(text="✨ 마법을 부리는 중...", state="disabled")
        
        threading.Thread(target=self._process_generation, args=(text,), daemon=True).start()

    def _process_generation(self, original_text):
        try:
            # 1. Generate Diary Text
            diary_prompt = f'다음 텍스트를 7세 아이가 쓴 그림일기 스타일로 3문장 이내로 요약해줘. 귀엽고 순수한 말투로:\n\n"{original_text}"'
            text_resp = self.client.models.generate_content(
                model="gemini-2.0-flash",
                contents=diary_prompt
            )
            diary_text = text_resp.text if text_resp.text else "일기를 쓸 수 없었어요."

            # 2. Generate Image
            gender = self.gender_var.get()
            img_prompt = (
                f"지브리 스튜디오 스타일의 감성적인 일러스트. "
                f"내용: {original_text}. "
                f"주인공: {gender} 아이 1명. "
                f"분위기: 따뜻함, 몽환적, 파스텔 톤. "
                f"텍스트 금지, 복잡한 디테일 생략."
            )
            
            img_resp = self.client.models.generate_content(
                model="models/gemini-2.0-flash-exp-image-generation",
                contents=img_prompt,
                config=genai_types.GenerateContentConfig(response_modalities=["IMAGE"])
            )
            
            image = None
            if img_resp.candidates and img_resp.candidates[0].content.parts:
                for part in img_resp.candidates[0].content.parts:
                     if part.inline_data:
                        image = Image.open(io.BytesIO(part.inline_data.data))
                        break

            # Update UI (Thread-safe)
            self.after(0, lambda: self._update_results(diary_text, image))

        except Exception as e:
            print(f"Generation Error: {e}")
            self.after(0, lambda: messagebox.showerror("오류", f"생성 중 문제가 발생했습니다: {e}"))
        finally:
            self.is_processing = False
            self.after(0, lambda: self.btn_generate.configure(text="🎨 그림일기 만들기", state="normal"))

    def _update_results(self, text, image):
        # Update Text
        self.output_text.configure(state="normal")
        self.output_text.delete("1.0", "end")
        self.output_text.insert("1.0", text)
        self.output_text.configure(state="disabled")

        # Update Image
        if image:
            # Resize keeping aspect ratio
            w, h = image.size
            target_w = 400 # Adjusted for right panel
            target_h = int(h * (target_w / w))
            
            image = image.resize((target_w, target_h), Image.Resampling.LANCZOS)
            photo = ImageTk.PhotoImage(image)
            
            self.image_display.configure(image=photo, text="")
            self.image_display.image = photo # Keep reference
        else:
            self.image_display.configure(text="이미지를 생성하지 못했습니다.")

if __name__ == "__main__":
    app = PictureDiaryApp()
    app.mainloop()
