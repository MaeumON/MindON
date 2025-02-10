package com.ssafy.mindon.auth.controller;

import com.ssafy.mindon.auth.dto.LoginRequestDto;
import com.ssafy.mindon.auth.dto.SignupRequestDto;
import com.ssafy.mindon.auth.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequestDto requestDto) {
        authService.signup(requestDto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequestDto loginRequestDto) {
        Map<String, Object> tokens = authService.login(loginRequestDto); // AuthService에서 로그인 처리
        return ResponseEntity.ok(tokens);
    }

    // 리프레시 토큰 갱신 (액세스 토큰이 만료일 때)
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refresh(@RequestBody Map<String, String> refreshTokenRequest) {
        String userId = refreshTokenRequest.get("userId");
        String refreshToken = refreshTokenRequest.get("refreshToken");

        Map<String, String> newTokens = authService.refresh(userId, refreshToken);
        return ResponseEntity.ok(newTokens);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestBody Map<String, String> logoutRequest) {
        String userId = logoutRequest.get("userId");
        authService.logout(userId); // 로그아웃 처리 (Redis에서 리프레시 토큰 삭제)
        return ResponseEntity.ok().build();
    }
}
