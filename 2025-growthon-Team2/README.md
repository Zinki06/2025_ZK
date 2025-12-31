# Gachitda (가치잇다)

대학생 재능 기부 교육 매칭 플랫폼입니다.

## 프로젝트 소개
대학생 간의 지식 공유와 재능 기부를 돕는 플랫폼입니다. 카카오 로그인과 학교 이메일 인증을 통해 신뢰할 수 있는 사용자 환경을 제공하며, 재능 기부자(Giver)와 수혜자(Taker)를 연결해줍니다.

## 주요 기능
- **사용자 인증**: 카카오 OAuth 로그인 및 대학교 이메일(.ac.kr) 인증
- **역할 선택**: 재능 기부자 / 수혜자 역할 선택 가능
- **재능 매칭**: 게시글 기반의 재능 기부 신청 및 매칭 시스템
- **알림**: 웹 푸시 알림 지원

## 기술 스택
- **Frontend**: React, Vite, Styled Components
- **Backend**: Node.js, Express, MongoDB
- **Deployment**: Netlify (FE), 자체 서버 (BE)

## 설치 및 실행

### 1. Repository Clone
```bash
git clone https://github.com/2025-growthon-Team2/gachitda.git
cd gachitda
```

### 2. Backend 실행
```bash
cd BE/server
npm install
# .env 설정 필요
npm start
```

### 3. Frontend 실행
```bash
cd FE
npm install
npm run dev
```

### 4. Database (Docker)
```bash
cd BE
docker-compose up -d mongo
```