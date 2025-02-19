# 마음ON(溫)
![스크린샷_2025-02-19_093837](/uploads/f68e44207bbe210cf67e3f7d58b621e2/스크린샷_2025-02-19_093837.png)
### 마음ON 링크 : https://i12b103.p.ssafy.io/
## 목차

## 포팅메뉴얼

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

### 추가 기능

## 기능 소개

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

![javascript](https://img.shields.io/badge/javascript-F0DB4F?style=for-the-badge&logo=javascript&logoColor=white)
![nodejs](https://img.shields.io/badge/nodejs-3C873A?style=for-the-badge&logo=node.js&logoColor=white)
![tailwind](https://img.shields.io/badge/tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![html](https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![css3](https://img.shields.io/badge/css3-1572B6?style=for-the-badge&logo=css3&logoColor=white)<img src="https://img.shields.io/badge/React_-61DAFB?style=for-the-badge&logo=React&logoColor=white"> <img src="https://img.shields.io/badge/Typescript_-3178C6?style=for-the-badge&logo=Typescript&logoColor=white"> <img src="https://img.shields.io/badge/zustand-000000?style=for-the-badge&logo=&logoColor=white"> <img src="https://img.shields.io/badge/Openvidu-232F3E?style=for-the-badge&logo=&logoColor=white">


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

![image](/uploads/11aac933e223de69c0a16811588f8d7a/image.png){width=1442 height=778}

## 설계 문서

### 요구사항 정의서

### 기능 명세서

### Flow Chart

### Mockup

### API 명세서 

## ERD
![mind_on_2__4_](/uploads/41cbee8e02990fb74daa563bc65ce5a5/mind_on_2__4_.png)

## 프로젝트 구조

### Frontend

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

## 발표자료

## 팀 구성원


| 역할   | 이름   | 담당 업무                          |
| ------ | ------ | --------------------------------- |
| **FE** | 이하영 | 화상 채팅 구현, 실시간 모임 관리 구현 |
| **FE** | 이현희 | 마이페이지 구현, 그룹 조회 및 회원관리 구현 |
| **FE** | 류현   | 메인 페이지 구현, 그룹 생성 및 리뷰 조회 구현 |
| **BE** | 지수인 | 회원 관리 구현, 실시간 모임 관리 구현 |
| **BE** | 박우담 | DB 담당, 그룹 관리 구현               |
| **INFRA** | 전아현 | 인프라 담당, 미팅 관리 구현          |
