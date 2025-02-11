# 1. Base 이미지 선택 (빌드용)
FROM openjdk:17-jdk-slim as builder

# ffmpeg 설치
RUN apt-get update && apt-get install -y ffmpeg

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. Gradle 빌드 환경 설정 (캐싱 최적화)
COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./
RUN chmod +x gradlew
RUN ./gradlew dependencies --no-daemon

# 4. 프로젝트 코드 복사 및 빌드 실행
COPY src src
RUN ./gradlew build --no-daemon

# 5. 실행용 JDK 이미지 설정
FROM openjdk:17-jdk-slim

# ffmpeg 설치 (실행 환경에도 필요할 경우 추가)
RUN apt-get update && apt-get install -y ffmpeg

# 6. 실행 디렉토리 설정
WORKDIR /app

# 7. 빌드된 JAR 파일 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# 8. Spring Boot는 기본 8080 포트에서 실행됨
EXPOSE 8080

# 9. 컨테이너 실행 명령어
ENTRYPOINT ["java", "-jar", "app.jar"]

