# Gachitda: 대학생 재능 기부 교육 매칭 플랫폼

## 개발 배경 및 목적

### 문제 제기

현재 대학생들은 다양한 전문 지식과 기술을 보유하고 있으나, 이를 활용한 지식 공유 및 상호 학습 기회가 제한적임. 기존의 교육 플랫폼들은 주로 일방향적 강의 형태로 운영되어 학습자 간 상호작용과 개인 맞춤형 교육이 부족함.

### 개발 목적

본 연구는 대학생 간 재능 기부를 통한 교육 매칭 플랫폼 "Gachitda"를 설계 및 구현하여, 학습자와 교육자를 효율적으로 연결하는 시스템을 개발함. 카카오 OAuth와 학교 이메일 인증을 통해 신뢰성 있는 사용자 기반을 구축하고, 실시간 매칭 알고리즘으로 최적의 교육 연결을 제공함.

## 최종 성과 요약

### 구현 성과

- **사용자 인증 시스템**: 카카오 OAuth + 학교 이메일(.ac.kr) 이중 인증 구현
- **역할 기반 매칭**: 재능 기부자(giver)와 수혜자(taker) 구분 매칭 시스템
- **실시간 알림**: 웹 푸시 알림을 통한 매칭 상태 실시간 전달
- **responsive UI**: 모바일 최적화된 393px 고정 너비 인터페이스

### 기술적 성과

| 지표 | 결과 |
|------|------|
| API 엔드포인트 | 15개 구현 |
| 데이터베이스 스키마 | User, Talent 2개 모델 설계 |
| 인증 방식 | JWT + 쿠키 기반 세션 관리 |
| 프론트엔드 컴포넌트 | 23개 재사용 가능 컴포넌트 |
| 환경변수 관리 | 8개 설정값 외부화 |

## 프로젝트 분석

### 시스템 아키텍처 설계

#### 프론트엔드 아키텍처
- **React + Vite**: 빠른 개발 환경과 모듈 번들링 최적화
- **React Router**: SPA 기반 다중 페이지 라우팅 구현
- **Styled Components**: CSS-in-JS를 통한 컴포넌트 스타일링
- **Axios**: RESTful API 통신 및 인터셉터 기반 인증 관리

#### 백엔드 아키텍처
- **Express.js**: Node.js 기반 경량 웹 프레임워크
- **MongoDB + Mongoose**: NoSQL 데이터베이스와 ODM 활용
- **JWT**: 무상태 인증 토큰 기반 보안 구현
- **Swagger**: OpenAPI 3.0 기반 API 문서화

### 인증 시스템 설계

```
카카오 OAuth → JWT 토큰 발급 → 학교 이메일 인증 → 역할 선택 → 서비스 이용
```

1. **1단계**: 카카오 OAuth를 통한 소셜 로그인
2. **2단계**: 학교 이메일(.ac.kr) 인증으로 대학생 신원 확인  
3. **3단계**: 재능 기부자 또는 수혜자 역할 선택
4. **4단계**: JWT 기반 세션 관리로 보안 유지

### 매칭 알고리즘 구현

#### 매칭 프로세스
1. **게시물 등록**: 재능 기부자가 교육 내용, 시간, 장소 등록
2. **필터링 검색**: 카테고리, 지역, 키워드 기반 검색 기능
3. **신청 관리**: 수혜자의 교육 신청 및 대기열 관리
4. **매칭 확정**: 기부자의 수동 선택을 통한 최종 매칭

#### 데이터 모델 설계

**User 스키마**
- providerId, kakaomail, email, role, writtenPosts, appliedPosts

**Talent 스키마**  
- writer, appliedTalents, matchedTalents, category, title, address, teachAt

### 실시간 알림 시스템

- **웹 푸시 API**: Service Worker 기반 브라우저 알림
- **VAPID 키**: 보안 푸시 메시지 인증
- **구독 관리**: 사용자별 알림 구독 상태 관리



### 시스템 요구사항

- **Node.js**: 18.x 이상
- **MongoDB**: 4.x 이상  
- **브라우저**: Chrome, Safari, Firefox 최신 버전

### 설치 및 실행

#### 1. 저장소 클론
```bash
git clone https://github.com/2025-growthon-Team2/gachitda.git
cd gachitda
```

#### 2. 백엔드 설정
```bash
cd BE/server
npm install
cp .env.example .env
# .env 파일에 환경변수 설정 필요
npm start
```

#### 3. 프론트엔드 설정  
```bash
cd FE
npm install
cp .env.example .env
# .env 파일에 API 서버 URL 설정
npm run dev
```

#### 4. 데이터베이스 설정
```bash
# MongoDB 컨테이너 실행
cd BE
docker-compose up -d mongo
```

### 환경변수 설정

**백엔드(.env)**
```
PORT=80
MONGODB_URI=mongodb://localhost:27017
CLIENT_URL=http://localhost:5173
KAKAO_JS_KEY=your_kakao_key
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```

**프론트엔드(.env)**
```
VITE_API_SERVER=http://localhost:80/
```

### API 문서

- **Swagger UI**: http://localhost:80/api-docs
- **API 기본 URL**: http://localhost:80/api

### 배포 환경

- **프론트엔드**: Netlify (https://gachitda.netlify.app)
- **백엔드**: 자체 서버 (https://gachitda.corexaen.com)
- **데이터베이스**: MongoDB Atlas

### 테스트 실행

```bash
# 프론트엔드 린트 검사
cd FE && npm run lint

# 백엔드 서버 상태 확인
curl http://localhost:80/api-docs
```

---

**개발진**: 2025 Growthon Team 2  
**개발 기간**: 2025.05  