# 마음ON(溫)
<p align="center">
   <img width="80%" src="https://github.com/user-attachments/assets/f84d2d55-d473-4b88-8f34-f721676ac8b1" alt="대표이미지">   
</p>

### 마음ON 링크 : https://i12b103.p.ssafy.io/
## 목차
1. [프로젝트 콘셉트](#프로젝트-콘셉트)
2. [핵심 기능](#핵심-기능)
3. [추가 기능](#추가-기능)
4. [기능 소개](#기능-소개)
5. [기술 스택](#기술-스택)
   - [Management Tool](#management-tool)
   - [IDE](#ide)
   - [Infra](#infra)
   - [Frontend](#frontend)
   - [Backend](#backend)
6. [서비스 아키텍처](#서비스-아키텍처)
7. [설계 문서](#설계-문서)
   - [요구사항 정의서](#요구사항-정의서)
   - [기능 명세서](#기능-명세서)
   - [Flow Chart](#flow-chart)
   - [Mockup](#mockup)
   - [API 명세서](#api-명세서)
8. [ERD](#erd)
9. [프로젝트 구조](#프로젝트-구조)
   - [Frontend](#frontend-1)
   - [Backend](#backend-1)
10. [포팅메뉴얼](#포팅메뉴얼)
11. [발표자료](#발표자료)
12. [팀 구성원](#팀-구성원)

## 프로젝트 콘셉트
### 질병으로 고통받는 사람들을 위한 온라인 자조모임 서비스
    
    → 실시간 모임 기능과 AI를 통해 심리적 지원과 사회적 연결을 돕는 통합 플랫폼

### 핵심 기능
- **온라인 자조모임 서비스**
  - 자조모임 맞춤 UI/UX 구현
  - 소규모 집중형 모임 지원
  - 안전한 모임을 위한 소통 관리 기능
- **디지털 사회자**
  - 발언자 지정
  - 모임 주제 제안
- **마음 리포트**
  - 마음 온도
  - 감정 기록 & 트래킹
  - 온이의 한마디 & 발화량

### 상세 기능
- **회원 관리**
  - Spring Security와 JWT를 활용한 인증 시스템 구축
  - 리프레시 토큰을 Redis에 저장함으로써 보안성 강화
  - 회원 신고 기능으로 건전한 커뮤니티 환경 조성
- **실시간 모임 관리**
  - OpenVidu를 사용해 실시간 소통 / 채팅 / 질문 제공 / 녹음 기능 구현
- **그룹 관리**
  - 관심 질병 기반으로 그룹 생성
  - 비밀방의 경우, 초대 코드를 통해야만 접근 가능
- **미팅 관리**
  - Spring scheduler를 활용해 데이터 상태 업데이트 자동화

## 기능 소개
### 메인 화면
[시연 영상 보기](https://github.com/MaeumON/MindON/blob/dev/%EC%82%B0%EC%B6%9C%EB%AC%BC/%EC%8B%9C%EC%97%B0%EC%98%81%EC%83%81.mp4)

<img width="50%" src="https://github.com/user-attachments/assets/54592b5d-8286-41af-8155-d767e5c5005d" alt="메인화면">  

### 실시간 모임 참여

<img width="50%" src="https://github.com/user-attachments/assets/16d7a4f5-a711-47fe-8d19-73cab5eb696c" alt="실시간 모임 참여">  

### 감정 기록 및 확인

<img width="50%" src="https://github.com/user-attachments/assets/eccc841e-123c-47cd-89a4-5edaed5f2921" alt="감정기록 및 확인"> 

### 모임 내용 분석

<img width="50%" src="https://github.com/user-attachments/assets/bb0a6e41-afe2-4452-99ad-425bfda14124" alt="모임 내용 분석"> 

## 기술 스택

### Management Tool

![gitlab](https://img.shields.io/badge/gitlab-FC6D26?style=for-the-badge&logo=gitlab&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![jira](https://img.shields.io/badge/jira-0052CC?style=for-the-badge&logo=jira&logoColor=white)
![notion](https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white)
![figma](https://img.shields.io/badge/figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)
### IDE

![intellij](https://img.shields.io/badge/intellij_idea-000000?style=for-the-badge&logo=intellijidea&logoColor=white)
![vscode](https://img.shields.io/badge/vscode-0078d7?style=for-the-badge&logo=visual%20studio&logoColor=white)
![postman](https://img.shields.io/badge/postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

### Infra

![amazonec2](https://img.shields.io/badge/amazon%20ec2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white)
![nginx](https://img.shields.io/badge/nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![docker](https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![ubuntu](https://img.shields.io/badge/ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white)
 <img src="https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=Jenkins&logoColor=white">


### Frontend

![html](https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![css3](https://img.shields.io/badge/css3-1572B6?style=for-the-badge&logo=css3&logoColor=white) 
<img src="https://img.shields.io/badge/Typescript_-3178C6?style=for-the-badge&logo=Typescript&logoColor=white"> 
<img src="https://img.shields.io/badge/React_-61DAFB?style=for-the-badge&logo=React&logoColor=white"> 
![nodejs](https://img.shields.io/badge/nodejs-3C873A?style=for-the-badge&logo=node.js&logoColor=white)
![tailwind](https://img.shields.io/badge/tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
<img src="https://img.shields.io/badge/zustand-000000?style=for-the-badge&logo=&logoColor=white"> 
<img src="https://img.shields.io/badge/React Query_-61DAFB?style=for-the-badge&logo=React&logoColor=white">
<img src="https://img.shields.io/badge/AXIOS-000000?style=for-the-badge&logo=&logoColor=white">
<img src="https://img.shields.io/badge/Openvidu-232F3E?style=for-the-badge&logo=&logoColor=white">


### Backend

![java](https://img.shields.io/badge/Java-007396?style=for-the-badge)
![springboot](https://img.shields.io/badge/spring%20boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![springjpa](https://img.shields.io/badge/spring%20jpa-6DB33F?style=for-the-badge&logo=Spring&logoColor=white)
![springsecurity](https://img.shields.io/badge/spring%20security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)
![jwt](https://img.shields.io/badge/jwt-000000?style=for-the-badge&logo=jwt&logoColor=white)
![redis](https://img.shields.io/badge/redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![mysql](https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
<img src="https://img.shields.io/badge/Openvidu-232F3E?style=for-the-badge&logo=&logoColor=white">


## 서비스 아키텍처

<img width="50%" src="https://github.com/user-attachments/assets/ed8bec8b-2df4-41a4-8b0c-069ab662ebc4" alt="서비스 아키텍처">  

## 설계 문서

### [요구사항 정의서](https://github.com/MaeumON/MindON/blob/dev/%EC%82%B0%EC%B6%9C%EB%AC%BC/%EC%9A%94%EA%B5%AC%EC%82%AC%ED%95%AD_%EC%A0%95%EC%9D%98%EC%84%9C.pdf)

### [기능 명세서](https://github.com/MaeumON/MindON/blob/dev/%EC%82%B0%EC%B6%9C%EB%AC%BC/%EA%B8%B0%EB%8A%A5_%EB%AA%85%EC%84%B8%EC%84%9C.pdf)

### [Flow Chart](https://github.com/MaeumON/MindON/blob/dev/%EC%82%B0%EC%B6%9C%EB%AC%BC/%ED%94%8C%EB%A1%9C%EC%9A%B0%EC%B0%A8%ED%8A%B8.pdf)

### [Mockup](https://github.com/MaeumON/MindON/blob/dev/%EC%82%B0%EC%B6%9C%EB%AC%BC/%ED%99%94%EB%A9%B4_%EB%AA%A9%EC%97%85.pdf)

### [API 명세서](https://github.com/MaeumON/MindON/blob/dev/%EC%82%B0%EC%B6%9C%EB%AC%BC/API_%EB%AA%85%EC%84%B8%EC%84%9C.pdf) 

## ERD

<img width="50%" src="https://github.com/user-attachments/assets/9122177e-8ae6-494c-9eb5-93aa01e0871a" alt="ERD">  

## 프로젝트 구조

### Frontend
```
frontend/
│── public/            # 정적 파일 (favicon, index.html 등)
│── src/               # 애플리케이션 코드
│   ├── apis/          # API 요청 관련 코드
│   │   ├── auth/      # 인증 관련 API
│   │   ├── group/     # 그룹 관련 API
│   │   ├── mypage/    # 마이페이지 API
│   │   ├── openvidu/  # 영상 통화 관련 API
│   │   ├── types/     # API 응답 타입 정의
│   ├── assets/        # 정적 리소스 (이미지, 아이콘, 스타일)
│   │   ├──fonts/
│   │   ├──icons/
│   │   ├──images/
│   │   ├──styles/
│   ├── components/    # UI 컴포넌트
│   │   ├── auth/      # 로그인 관련 컴포넌트
│   │   ├── common/    # 공통 UI 컴포넌트
|   │   ├── group/     # 모임관련 컴포넌트
│   │   ├── Layout/    # 헤더와 푸터 등 레이아웃상 컴포넌트
│   │   ├── Mainpage/  # 메인페이지 관련 컴포넌트
│   │   ├── Mydata/    # 마음리포트 관련 컴포넌트
│   │   ├── OpenVidu-call # 오픈비두 관련 컴포넌트
│   ├── data/          # 임시 데이터 또는 더미 데이터
│   ├── hooks/         # 커스텀 훅 정의
│   ├── mocks/         # MSW(Mock Service Worker) 관련 코드
│   ├── pages/         # 개별 페이지 (라우트 단위)
│   │   ├── admin/     # 관리자 페이지
│   │   ├── auth/      # 로그인/회원가입 페이지
│   │   ├── group/     # 그룹 관련 페이지
│   │   ├── mypage/    # 마이페이지
│   │   ├── openvidu/  # 영상 통화 페이지
│   │   ├── Main.tsx   # 메인 페이지
│   │   ├── Welcome.tsx # 환영 페이지
│   ├── stores/        # Zustand 상태 관리 파일
│   ├── utils/         # 유틸리티 함수 모음
│   │   ├── openvidu   # 오픈비두 시그널 함수 모음
│   ├── App.tsx        # 루트 컴포넌트
│   ├── index.tsx      # 진입점 (ReactDOM.render)
│   ├── main.css       # 글로벌 스타일
│   ├── ProtectRouter.tsx # 라우트 보호 컴포넌트
│   ├── vite-env.d.ts  # Vite 환경 변수 타입
│── .env.development   # 환경 변수 파일
│── package.json       # 패키지 및 스크립트 설정
│── tsconfig.json      # TypeScript 설정 파일
│── vite.config.ts     # Vite 설정 파일
│── tailwind.config.js # Tailwind CSS 설정
│── eslint.config.js   # ESLint 설정 파일
```

### Backend
```
mindon
├── auth
│   ├── controller
│   ├── dto
│   └── service
├── common
│   ├── config
│   ├── error
│   ├── exception
│   └── util
├── disease
│   ├── controller
│   ├── entity
│   ├── repository
│   └── service
├── emotion
│   ├── entity
│   └── repository
├── group
│   ├── controller
│   ├── dto
│   ├── entity
│   ├── repository
│   ├── scheduler
│   └── service
├── meeting
│   ├── controller
│   ├── dto
│   ├── entity
│   ├── repository
│   ├── scheduler
│   └── service
├── question
│   ├── dto
│   ├── entity
│   └── repository
├── report
│   ├── controller
│   ├── dto
│   ├── entity
│   ├── repository
│   └── service
├── stt
│   ├── entity
│   ├── repository
│   └── service
├── user
│   ├── controller
│   ├── dto
│   ├── entity
│   ├── repository
│   └── service
├── usergroup
│   ├── entity
│   └── repository
├── userreview
│   ├── controller
│   ├── dto
│   ├── entity
│   ├── repository
│   └── service
└── video
    ├── controller
    ├── dto
    └── service
```

### [포팅메뉴얼](https://github.com/MaeumON/MindON/blob/dev/%EC%82%B0%EC%B6%9C%EB%AC%BC/%ED%8F%AC%ED%8C%85_%EB%A9%94%EB%89%B4%EC%96%BC.pdf)

## [발표자료](https://github.com/MaeumON/MindON/blob/dev/%EC%82%B0%EC%B6%9C%EB%AC%BC/%EB%A7%88%EC%9D%8C%EC%98%A8-%EC%B5%9C%EC%A2%85%EB%B3%B8-PPT.pptx)

## 팀 구성원


| 역할   | 이름   | 담당 업무                          |
| ------ | ------ | --------------------------------- |
| **FE** | 이하영 | 화상 채팅 구현, 실시간 모임 관리 구현 |
| **FE** | 이현희 | 마이페이지 구현, 그룹 조회 및 회원관리 구현 |
| **FE** | 류현   | 메인 페이지 구현, 그룹 생성 및 리뷰 조회 구현 |
| **BE** | 지수인 | 회원 관리 구현, 실시간 모임 관리 구현 |
| **BE** | 박우담 | DB 담당, 그룹 관리 구현               |
| **INFRA** | 전아현 | 인프라 담당, 미팅 관리 구현          |

