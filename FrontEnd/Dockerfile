# Node.js 20 버전 기반으로 빌드
FROM node:20.10.0 AS build
WORKDIR /app

# Corepack 활성화 및 Yarn Berry 설정
RUN corepack enable 
##RUN yarn set version berry  

# Yarn 캐시 폴더를 Linux 환경에 맞게 재설정
##RUN yarn config set cacheFolder /app/.yarn/cache

# package.json 및 yarn.lock 복사 (프로젝트 의존성 파일)
COPY package.json yarn.lock ./

# 의존성 설치 및 타입스크립트 설치
# RUN yarn install
##RUN yarn add -D typescript
##RUN yarn install --check-cache

# 나머지 소스 파일 복사
COPY . . 

# .pnp.cjs 파일이 생성되었는지 확인 (PnP 모드 정상 작동 여부 점검)
##RUN test -f /app/.pnp.cjs || { echo "❌ .pnp.cjs 파일이 없습니다! 빌드를 중단합니다."; exit 1; }

# 빌드 실행 (yarn build 스크립트가 package.json에 등록되어 있어야 함)
RUN yarn build

# 빌드 결과물 확인
RUN ls -al /app/ && ls -al /app/dist/ || echo "⚠️ 빌드된 dist 폴더가 없습니다!"

# Nginx 컨테이너를 위한 멀티 스테이지 빌드: 빌드 결과물만 복사
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
