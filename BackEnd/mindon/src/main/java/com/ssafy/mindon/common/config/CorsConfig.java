package com.ssafy.mindon.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 경로에 대해 CORS 허용
                .allowedOrigins("http://localhost:3000") // React 앱의 주소 (로컬 환경의 React 앱 포트)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH") // 허용할 HTTP 메소드 설정
                .allowedHeaders("*") // 모든 헤더를 허용
                .allowCredentials(true) // 자격 증명(쿠키 등)을 허용할지 설정
                .maxAge(3600); // pre-flight 요청 캐싱 시간 설정 (1시간)
    }
}