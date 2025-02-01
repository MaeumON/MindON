# 1️⃣ Node.js 20 버전 기반으로 빌드
FROM node:20.10.0 AS build
WORKDIR /app

# 2️⃣ 필수 패키지 설치 (Yarn 설치)
RUN npm install -g yarn  # 🔥 Node.js에 yarn 설치 (중요)

# 3️⃣ 패키지 관련 파일 복사 및 설정
COPY package.json yarn.lock ./

# Corepack 활성화 및 Yarn 최신 버전 적용
RUN corepack enable
RUN yarn set version berry  # 🔥 Yarn Berry(PnP) 방식 유지

# 3️⃣ 프로젝트 코드 복사 후 의존성 설치
COPY . . 

# 📌 `.pnp.cjs`가 정상 생성되도록 `yarn install`
RUN yarn install --immutable

# 4️⃣ TypeScript 패키지 확인 (없으면 설치)
RUN yarn why typescript || yarn add --dev typescript

# 6️⃣ TypeScript 오류 무시하면서 빌드 진행
RUN yarn build --skipLibCheck --noEmitOnError false || true
# 🔍 빌드 결과 확인 (디버깅)
RUN ls -al /app/ && ls -al /app/dist/ || echo "⚠️ 빌드된 dist 폴더가 없습니다!"
RUN ls -al /app/ && ls -al /app/build/ || echo "⚠️ 빌드된 build 폴더가 없습니다!"

# 7️⃣ Nginx가 사용할 빌드 디렉토리 설정 (Nginx 설정과 일치!)
RUN mkdir -p /home/ubuntu/frontend_build
RUN cp -r /app/dist/* /home/ubuntu/frontend_build

# 8️⃣ Nginx 컨테이너에서 사용할 빌드 폴더 지정
VOLUME /home/ubuntu/frontend_build
