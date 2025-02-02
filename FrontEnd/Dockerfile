# Node.js 20 버전 기반으로 빌드
FROM node:20.10.0 AS build
WORKDIR /app

RUN corepack enable 
RUN yarn set version berry  

# package.json 및 yarn.lock 복사
COPY package.json yarn.lock ./

# `.pnp.cjs`가 정상 생성되도록 `yarn install`
RUN yarn install
RUN yarn add -D typescript
RUN yarn install --check-cache
# RUN yarn config set nodeLinker pnp
COPY . . 

# `.pnp.cjs` 파일이 정상적으로 생성되었는지 확인 (없으면 빌드 중단)
# RUN test -f /app/.pnp.cjs || { echo "❌ .pnp.cjs 파일이 없습니다! 빌드를 중단합니다."; exit 1; }

# TypeScript 패키지 확인 (없으면 설치)
# RUN yarn why typescript || yarn add --dev typescript

# 기존 Vite 설정 유지하면서 `outDir: "dist"` 추가
RUN echo 'import { defineConfig } from "vite"; import react from "@vitejs/plugin-react"; export default defineConfig({ plugins: [react()], build: { outDir: "dist", emptyOutDir: true } });' > vite.config.ts
RUN yarn build
RUN ls -al /app/ && ls -al /app/dist/ || echo "⚠️ 빌드된 dist 폴더가 없습니다!"

# Nginx 컨테이너에서 사용할 빌드 폴더 지정
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# 7. 기본 Nginx 설정 유지
EXPOSE 80
# EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]