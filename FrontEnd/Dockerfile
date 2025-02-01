# 1️⃣ Node.js 20 버전 기반으로 빌드
FROM node:20.10.0 AS build
WORKDIR /app

# 2️⃣ 패키지 관련 파일 복사 및 설정
COPY package.json yarn.lock ./

# Corepack 활성화 및 Yarn 최신 버전 적용
RUN corepack enable
RUN yarn set version berry  # 🔥 Yarn Berry(PnP) 방식 유지
# RUN yarn plugin import typescript  # 🔥 TypeScript 플러그인 추가

# 📌 PnP 방식 설정을 위해 node-modules 사용 안함
# RUN yarn config set nodeLinker pnp

# 3️⃣ 프로젝트 코드 복사 후 의존성 설치
COPY . . 

# 📌 `.pnp.cjs`가 정상 생성되도록 `yarn install`
RUN yarn install --immutable

# 4️⃣ TypeScript 패키지 확인 (없으면 설치)
RUN yarn why typescript || yarn add --dev typescript

# 6️⃣ TypeScript 오류 무시하면서 빌드 진행
RUN yarn build 
# --skipLibCheck --noEmitOnError false || true

# 7️⃣ Nginx가 사용할 빌드 디렉토리 설정 (Nginx 설정과 일치!)
RUN mkdir -p /home/ubuntu/frontend_build
RUN cp -r /app/dist/* /home/ubuntu/frontend_build

# 8️⃣ Nginx 컨테이너에서 사용할 빌드 폴더 지정
VOLUME /home/ubuntu/frontend_build
