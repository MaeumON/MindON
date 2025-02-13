package com.ssafy.mindon.auth.controller;

import com.ssafy.mindon.auth.dto.LoginRequestDto;
import com.ssafy.mindon.auth.dto.SignupRequestDto;
import com.ssafy.mindon.auth.service.AuthService;
import com.ssafy.mindon.common.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final JwtUtil jwtUtil;

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
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String accessToken) {
        // 액세스 토큰에서 신고한 유저 ID 추출
        String userId = jwtUtil.extractUserId(accessToken);
        authService.logout(userId); // 로그아웃 처리 (Redis에서 리프레시 토큰 삭제)
        return ResponseEntity.ok().build();
    }
    @PostMapping("/userid")
    public ResponseEntity<Map<String, String>> findUserId(@RequestBody Map<String, String> request) {
        String userName = request.get("userName");
        String phone = request.get("phone");

        String userId = authService.findUserId(userName, phone); // 회원 ID 조회

        return ResponseEntity.ok(Map.of("userId", userId));
    }

    @PostMapping("/password")
    public ResponseEntity<Map<String, Boolean>> findUser(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        String phone = request.get("phone");

        boolean status = authService.isUserExists(userId, phone); // 회원 ID 조회

        return ResponseEntity.ok(Map.of("status", status));
    }

    @PostMapping("/password/reset")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        String newPassword = request.get("password");

        authService.resetPassword(userId, newPassword); // 비밀번호 재설정 처리
        return ResponseEntity.ok("Password reset successful.");
    }

    @PostMapping("/check-id")
    public ResponseEntity<?> checkId(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");

        boolean response = authService.isIdAvailable(userId); 
        return ResponseEntity.ok(response);
    }
}
