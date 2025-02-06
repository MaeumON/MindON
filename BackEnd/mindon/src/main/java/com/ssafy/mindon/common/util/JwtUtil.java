package com.ssafy.mindon.common.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
@Component
public class JwtUtil {

    private static final String SECRET = "T8m7sWvRtPz1RTo3A6+RYlw2Jf1kJQxZV5T9xJHGhF0=";
    private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(Base64.getDecoder().decode(SECRET));
    //    private static final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256); // 실제로는 env나 properties에서 관리해야 함
    private long accessTokenExpirationTime = 1000 * 60 * 60; // 1시간
    private long refreshTokenExpirationTime = 1000 * 60 * 60 * 24 * 7; // 7일

    // 액세스 토큰 생성
    public String generateAccessToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpirationTime))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();

    }

    // 리프레시 토큰 생성
    public String generateRefreshToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenExpirationTime))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    // JWT에서 Claims 추출
    public Claims extractClaims(String token) {
        // "Bearer " 접두어가 있다면 제거
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }

    // JWT에서 사용자 이름 추출
    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    // JWT에서 User ID 추출
    public String extractUserId(String token) {
        return extractUsername(token); // extractUsername을 재활용
    }

    // 토큰 만료 여부 확인
    public boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }

    // 토큰 유효성 검사
    public boolean validateToken(String token, String username) {
        return (username.equals(extractUsername(token)) && !isTokenExpired(token));
    }

    //postman에서 테스트할 때 사용할 토큰 생성
    public static void main(String[] args) {
        JwtUtil jwtUtil = new JwtUtil();
        String token = jwtUtil.generateAccessToken("user1");
        System.out.println("Generated Token: " + token);
    }


}
