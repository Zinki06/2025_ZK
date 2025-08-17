import os
import io
import customtkinter as ctk
from tkinter import messagebox
from PIL import Image, ImageTk
import speech_recognition as sr
from dotenv import load_dotenv
from google import genai
from google.genai import types as genai_types

# 설정 상수
PRIMARY_COLOR = "#017DB3"
SECONDARY_COLOR = "#8CD4EA"
BACKGROUND_COLOR = "#ffdfdf"
PANEL_COLOR = "#F0FAFC"
ACCENT_COLOR = "#F7A6A6"

WINDOW_WIDTH = 1200
WINDOW_HEIGHT = 800
INPUT_HEIGHT = 400
OUTPUT_HEIGHT = 200
BUTTON_WIDTH = 180
BUTTON_HEIGHT = 50

# 환경 변수 로드
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("오류: .env 파일에 GEMINI_API_KEY를 설정하세요.")
    exit(1)

generative_client = genai.Client(api_key=GEMINI_API_KEY)


# 전역 변수
app_state = {
    'input_text': None,
    'output_text': None,
    'image_label': None,
    'gender_var': None
}

def create_main_window():
    """메인 윈도우 생성"""
    app = ctk.CTk()
    app.title("그림일기 체험기")
    app.geometry(f"{WINDOW_WIDTH}x{WINDOW_HEIGHT}")
    ctk.set_appearance_mode("light")
    app.configure(fg_color=BACKGROUND_COLOR)
    return app

def create_main_frame(app):
    """메인 프레임 생성"""
    outer_frame = ctk.CTkFrame(app, fg_color=BACKGROUND_COLOR)
    outer_frame.pack(expand=True)
    
    main_frame = ctk.CTkFrame(outer_frame, corner_radius=20, fg_color=BACKGROUND_COLOR)
    main_frame.grid(row=0, column=0, padx=40, pady=60)
    main_frame.grid_columnconfigure(0, weight=1)
    main_frame.grid_columnconfigure(1, weight=1)
    return main_frame

def create_input_panel(main_frame):
    """입력 패널 생성"""
    left_frame = ctk.CTkFrame(main_frame, corner_radius=20, fg_color=PANEL_COLOR)
    left_frame.grid(row=0, column=0, sticky="nsew", padx=40, pady=30)
    
    ctk.CTkLabel(left_frame, text="말하거나 글로 적어서 일기를 그림으로 바꿔보세요", 
                font=("맑은 고딕", 18, "bold"), text_color="black").pack(pady=20)
    
    input_text = ctk.CTkTextbox(left_frame, height=INPUT_HEIGHT, width=700, 
                               font=("맑은 고딕", 15, "bold"), corner_radius=10, 
                               border_width=1, border_color="#CCCCCC", text_color="black")
    input_text.pack(padx=30, pady=15, fill="x")
    app_state['input_text'] = input_text
    
    button_frame = ctk.CTkFrame(left_frame, fg_color="transparent")
    button_frame.pack(pady=15)
    
    ctk.CTkButton(button_frame, text="일기로 변환", command=transform_text,
                 width=BUTTON_WIDTH, height=BUTTON_HEIGHT, fg_color=SECONDARY_COLOR, 
                 text_color="black", hover_color=PRIMARY_COLOR, 
                 font=("맑은 고딕", 15, "bold")).grid(row=0, column=0, padx=10)
    
    ctk.CTkButton(button_frame, text="그림 생성", command=generate_image,
                 width=BUTTON_WIDTH, height=BUTTON_HEIGHT, fg_color=SECONDARY_COLOR, 
                 text_color="black", hover_color=PRIMARY_COLOR, 
                 font=("맑은 고딕", 15, "bold")).grid(row=0, column=1, padx=10)
    
    ctk.CTkButton(button_frame, text="말로 그림 생성", command=speech_to_image,
                 width=BUTTON_WIDTH, height=BUTTON_HEIGHT, fg_color=SECONDARY_COLOR, 
                 text_color="black", hover_color=PRIMARY_COLOR, 
                 font=("맑은 고딕", 15, "bold")).grid(row=0, column=2, padx=10)
    
    ctk.CTkLabel(left_frame, text="아이 성별 선택:", 
                font=("맑은 고딕", 15, "bold"), text_color="black").pack(pady=(15, 5))
    gender_var = ctk.StringVar(value="남자")
    app_state['gender_var'] = gender_var
    gender_menu = ctk.CTkOptionMenu(left_frame, variable=gender_var, values=["남자", "여자"], 
                                   fg_color=ACCENT_COLOR, text_color="white", 
                                   button_color=PRIMARY_COLOR)
    gender_menu.pack(pady=(0, 20))
    
    return left_frame

def create_output_panel(main_frame):
    """출력 패널 생성"""
    right_frame = ctk.CTkFrame(main_frame, corner_radius=20, fg_color=PANEL_COLOR)
    right_frame.grid(row=0, column=1, sticky="nsew", padx=40, pady=30)
    
    ctk.CTkLabel(right_frame, text="변환된 일기 내용:", 
                font=("맑은 고딕", 18, "bold"), text_color="black").pack(pady=(20, 10))
    
    output_text = ctk.CTkTextbox(right_frame, height=OUTPUT_HEIGHT, width=600, 
                                font=("맑은 고딕", 13), corner_radius=10, 
                                border_width=1, border_color="#CCCCCC", text_color="black")
    output_text.pack(padx=30, pady=10, fill="x")
    output_text.configure(state="disabled")
    app_state['output_text'] = output_text
    
    image_label = ctk.CTkLabel(right_frame, text="")
    image_label.pack(pady=30)
    app_state['image_label'] = image_label
    
    return right_frame

def transform_text():
    """텍스트를 일기 스타일로 변환"""
    original_content = app_state['input_text'].get("1.0", "end").strip()
    if not original_content:
        messagebox.showwarning("경고", "원본 내용을 입력하세요.")
        return
    try:
        transformed_content = call_gemini_for_diary(original_content)
        update_output_text(transformed_content)
    except Exception as e:
        messagebox.showerror("오류", f"텍스트 변환 중 오류 발생: {e}")

def call_gemini_for_diary(text: str) -> str:
    """그림일기 스타일로 텍스트 변환"""
    prompt = f'다음 텍스트를 5세에서 13세 사이의 아이가 그림일기에 쓸 법한 3~5 문장의 짧은 글로 바꿔줘. 친근하고 쉬운 단어를 사용해줘. 기존 내용에 충실하도록 해줘:\n\n"{text}"'
    response = generative_client.models.generate_content(
        model="models/gemini-2.0-flash-exp-image-generation",
        contents=prompt,
        config=genai_types.GenerateContentConfig(response_modalities=["TEXT"])
    )
    if response.candidates and response.candidates[0].content.parts:
        return response.candidates[0].content.parts[0].text
    elif hasattr(response, 'text'):
        return response.text
    else:
        raise Exception("Gemini API로부터 텍스트를 추출할 수 없습니다.")

def call_gemini_generate(text: str):
    """이미지 생성 요청"""
    gender = app_state['gender_var'].get()
    combined_prompt = (
        f"다음 문장을 바탕으로 지브리 애니메이션 스타일의 일러스트를 그려줘. "
        f"문장: \"{text}\"\n\n"
        f"그림에는 반드시 {gender} 아이가 등장해야 하고, 문장의 내용이 그림으로 잘 전달되어야 해. "
        f"배경은 몽환적이고 동화 같은 느낌으로, 부드러운 색감과 따뜻한 분위기로 그려줘. "
        f"글자는 포함하지 말고, 인물은 반드시 1명만 있어야 해."
    )
    response = generative_client.models.generate_content(
        model="models/gemini-2.0-flash-exp-image-generation",
        contents=combined_prompt,
        config=genai_types.GenerateContentConfig(response_modalities=["TEXT", "IMAGE"])
    )
    text_output = ""
    image = None
    for part in response.candidates[0].content.parts:
        if part.text is not None:
            text_output += part.text
        elif part.inline_data is not None:
            image = Image.open(io.BytesIO(part.inline_data.data))
    return text_output, image

def show_image(pil_img):
    """이미지 표시"""
    img = pil_img.copy()
    img.thumbnail((700, 700))
    tk_img = ImageTk.PhotoImage(img)
    app_state['image_label'].configure(image=tk_img)
    app_state['image_label'].image = tk_img

def generate_image():
    """이미지 생성"""
    original_content = app_state['input_text'].get("1.0", "end").strip()
    if not original_content:
        messagebox.showwarning("경고", "원본 내용을 입력하세요.")
        return
    try:
        text, image = call_gemini_generate(original_content)
        if image:
            show_image(image)
        update_output_text(text)
    except Exception as e:
        messagebox.showerror("오류", f"그림 생성 중 오류 발생: {e}")

def speech_to_image():
    """음성 인식 후 이미지 생성"""
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        messagebox.showinfo("말하기 시작", "이제 말을 시작하세요. 멈추면 자동으로 인식합니다.")
        audio = recognizer.listen(source)
    try:
        spoken_text = recognizer.recognize_google(audio, language="ko-KR")
        app_state['input_text'].delete("1.0", "end")
        app_state['input_text'].insert("1.0", spoken_text)
        generate_image()
    except sr.UnknownValueError:
        messagebox.showerror("오류", "음성을 인식할 수 없습니다.")
    except sr.RequestError as e:
        messagebox.showerror("오류", f"STT 요청 중 오류 발생: {e}")


def update_output_text(text):
    """출력 텍스트 업데이트"""
    app_state['output_text'].configure(state="normal")
    app_state['output_text'].delete("1.0", "end")
    app_state['output_text'].insert("1.0", text)
    app_state['output_text'].configure(state="disabled")

def main():
    """메인 함수"""
    if not GEMINI_API_KEY or not GEMINI_API_KEY.startswith("AIza"):
        print("오류: .env 파일에서 유효한 GEMINI_API_KEY를 설정하세요.")
        return
    
    app = create_main_window()
    main_frame = create_main_frame(app)
    create_input_panel(main_frame)
    create_output_panel(main_frame)
    app.mainloop()

if __name__ == "__main__":
    main()
