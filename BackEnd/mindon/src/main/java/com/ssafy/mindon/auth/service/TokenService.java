package com.ssafy.mindon.auth.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class TokenService {

    private final RedisTemplate<String, Object> redisTemplate;

    public TokenService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    // 리프레시 토큰 저장
    public void saveRefreshToken(String username, String refreshToken) {
        redisTemplate.opsForValue().set(username, refreshToken, 7, TimeUnit.DAYS);
    }

    // 리프레시 토큰 검증
    public boolean validateRefreshToken(String username, String refreshToken) {
        String storedToken = (String) redisTemplate.opsForValue().get(username);
        return storedToken != null && storedToken.equals(refreshToken);
    }

    // 리프레시 토큰 삭제
    public void deleteRefreshToken(String username) {
        redisTemplate.delete(username);
    }
}
