# Stage 1: Build the React app
FROM node:20.10.0 AS build

# Set working directory
WORKDIR /app

# Install dependencies
RUN yarn
#--immutable

# Copy the rest of the source code
COPY . /app

# Ensure TypeScript is installed
RUN yarn add --dev typescript

# Copy tsconfig files
COPY tsconfig.json tsconfig.app.json tsconfig.node.json ./
RUN yarn build  
# 빌드 결과물 -> /app/build

# 2) 배포 스테이지
# FROM nginx:1.23-alpine  
# # Nginx가 /usr/share/nginx/html 디렉토리에서 정적파일을 제공한다고 가정

# # 1) nginx 메인 설정 교체 (옵션): events/http 블록 등 포함
# COPY nginx.conf /etc/nginx/nginx.conf

# # 2) 서버 블록 설정(여기서 SSL, 리버스프록시, SPA 세팅 등을 작성)
# COPY default.conf /etc/nginx/conf.d/default.conf

# COPY --from=build /app/dist /usr/share/nginx/html

# EXPOSE 80
# EXPOSE 443
# CMD ["nginx", "-g", "daemon off;"]
