package com.ssafy.mindon.auth.controller;

import com.ssafy.mindon.auth.dto.SignupRequestDto;
import com.ssafy.mindon.auth.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    // 회원 가입 API 엔드포인트를 정의

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequestDto requestDto) {
        authService.signup(requestDto);
        System.out.print("ddd");
        return ResponseEntity.ok("Signup successful");
    }
}
