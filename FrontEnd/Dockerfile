# 1. Node.js 20 버전 기반으로 빌드
FROM node:20 AS build
WORKDIR /app

# 2. 패키지 설치 및 빌드
COPY package.json yarn.lock ./

# Corepack 활성화 및 Yarn 버전 고정
RUN corepack enable
RUN yarn set version 4.6.0  

# 3. 패키지 설치 및 빌드
COPY . . 
RUN yarn install --immutable
RUN yarn build

# TypeScript 패키지 확인
RUN yarn why typescript || echo "⚠️ TypeScript 패키지 없음!"

# 코드 복사 및 빌드 실행
COPY . .
RUN yarn build--skipLibCheck --noEmitOnError false || true
