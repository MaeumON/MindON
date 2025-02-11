package com.ssafy.mindon.user.controller;

import com.ssafy.mindon.common.error.ErrorCode;
import com.ssafy.mindon.common.exception.AuthException;
import com.ssafy.mindon.meeting.dto.UpcomingMeetingResponseDto;
import com.ssafy.mindon.user.UserEmotionResponseDto;
import com.ssafy.mindon.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.ssafy.mindon.common.util.JwtUtil;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final JwtUtil jwtUtil;
    private final UserService userService;

    @GetMapping("/temparature")
    public ResponseEntity<?> getTemparature(@RequestHeader(HttpHeaders.AUTHORIZATION) String accessToken){
        try {
            if (jwtUtil.isTokenExpired(accessToken)) {
                throw new AuthException(ErrorCode.EXPIRED_ACCESS_TOKEN);
            }
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            throw new AuthException(ErrorCode.EXPIRED_ACCESS_TOKEN); // 원하는 예외 던지기
        }

        String userId = jwtUtil.extractUserId(accessToken);

        UserEmotionResponseDto responseDto  = userService.calculateUserEmotionScore(userId);
        return ResponseEntity.ok(responseDto );

    }

    @PatchMapping()
    public ResponseEntity<?> deleteUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String accessToken) {
        try {
            if (jwtUtil.isTokenExpired(accessToken)) {
                throw new AuthException(ErrorCode.EXPIRED_ACCESS_TOKEN);
            }
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            throw new AuthException(ErrorCode.EXPIRED_ACCESS_TOKEN);
        }

        String userId = jwtUtil.extractUserId(accessToken);
        userService.deleteUser(userId);

        return ResponseEntity.ok("회원 탈퇴가 완료되었습니다.");
    }


}
