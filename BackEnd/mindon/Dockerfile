# 1) 빌드 스테이지
FROM gradle:7.6-jdk17 AS builder
WORKDIR /app
COPY . .
# gradle wrapper나 gradle 설정이 있다면 그대로 복사
# 빌드 (테스트는 필요 시 -x test 등 생략 가능)
RUN gradle clean build -x test

# 2) 배포 스테이지
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
# 빌드 스테이지에서 생성된 jar만 복사
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
