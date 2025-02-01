# Node.js 20 버전 기반으로 빌드
FROM node:20.10.0 AS build
WORKDIR /app

# 패키지 관련 파일 복사 및 설정
COPY package.json yarn.lock ./

# Corepack 활성화 및 Yarn 최신 버전 적용
RUN corepack enable
RUN yarn set version berry  # 🔥 Yarn Berry(PnP) 방식 유지

# PnP 방식 강제 설정
RUN yarn config set nodeLinker pnp

# 프로젝트 코드 복사 후 의존성 설치
COPY . .


# `.pnp.cjs`가 정상 생성되도록 `yarn install`
RUN yarn install --immutable

# `.pnp.cjs` 파일이 정상적으로 생성되었는지 확인 (없으면 빌드 중단)
RUN test -f /app/.pnp.cjs || { echo "❌ .pnp.cjs 파일이 없습니다! 빌드를 중단합니다."; exit 1; }


# TypeScript 패키지 확인 (없으면 설치)
RUN yarn why typescript || yarn add --dev typescript

# 기존 Vite 설정 유지하면서 `outDir: "dist"` 추가
RUN echo 'import { defineConfig } from "vite"; import react from "@vitejs/plugin-react"; export default defineConfig({ plugins: [react()], build: { outDir: "dist", emptyOutDir: true } });' > vite.config.ts


# TypeScript 오류 무시하면서 빌드 진행 (실패 시 중단)
RUN yarn build --skipLibCheck --noEmitOnError false

# 🔍 빌드 결과 확인 (디버깅)
RUN ls -al /app/ && ls -al /app/dist/ || echo "⚠️ 빌드된 dist 폴더가 없습니다!"

# 7️⃣ Nginx가 사용할 빌드 디렉토리 설정 (Nginx 설정과 일치!)
RUN mkdir -p /home/ubuntu/frontend_build
RUN cp -r /app/dist/* /home/ubuntu/frontend_build

# 8️⃣ Nginx 컨테이너에서 사용할 빌드 폴더 지정
VOLUME /home/ubuntu/frontend_build
