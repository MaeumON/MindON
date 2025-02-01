# 1. Node.js 20 버전 기반으로 빌드
FROM node:20 AS build
WORKDIR /app

# 2. 패키지 설치 및 빌드
COPY package.json yarn.lock ./

# Corepack 활성화
RUN corepack enable

# Yarn 설치
RUN yarn set version 4.6.0  # package.json에 맞춘 버전으로 설정

RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# 3. 빌드된 파일을 /home/ubuntu/frontend_build로 복사
RUN mkdir -p /home/ubuntu/frontend_build
RUN cp -r /app/dist/* /home/ubuntu/frontend_build
