package com.ssafy.mindon.user.controller;

import com.ssafy.mindon.auth.service.AuthService;
import com.ssafy.mindon.common.error.ErrorCode;
import com.ssafy.mindon.common.exception.AuthException;
import com.ssafy.mindon.user.dto.SpeakerListDto;
import com.ssafy.mindon.user.dto.UserEmotionResponseDto;
import com.ssafy.mindon.user.dto.UserProfileResponseDto;
import com.ssafy.mindon.user.dto.UserProfileUpdateRequest;
import com.ssafy.mindon.user.service.UserService;
import com.ssafy.mindon.video.service.VideoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.ssafy.mindon.common.util.JwtUtil;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final AuthService authService;
    private final VideoService videoService;

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

    @GetMapping("/{groupId}/list")
    public ResponseEntity<?> getSpeakerList(@PathVariable Integer groupId) {
        String id = String.valueOf(groupId);
        try {
            Set<String> speakerIds = videoService.getParticipants(id);
            //Set<String> speakerIds = Set.of("user02", "user03");
            SpeakerListDto speakerListDto = userService.getSpeakerList(groupId,speakerIds);

            return ResponseEntity.ok(speakerListDto);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponseDto> getUserProfile(@RequestHeader("Authorization") String accessToken) {
        try {
            if (jwtUtil.isTokenExpired(accessToken)) {
                throw new AuthException(ErrorCode.EXPIRED_ACCESS_TOKEN);
            }
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            throw new AuthException(ErrorCode.EXPIRED_ACCESS_TOKEN);
        }

        String userId = jwtUtil.extractUserId(accessToken);
        
        // 사용자 정보 조회
        UserProfileResponseDto userProfile = userService.getUserProfile(userId);

        return ResponseEntity.ok(userProfile);
    }

    @PatchMapping("/profile")
    public ResponseEntity<?> updateUserProfile(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String accessToken,
            @RequestBody UserProfileUpdateRequest request) {
        try {
            if (jwtUtil.isTokenExpired(accessToken)) {
                throw new AuthException(ErrorCode.EXPIRED_ACCESS_TOKEN);
            }
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            throw new AuthException(ErrorCode.EXPIRED_ACCESS_TOKEN);
        }

        String userId = jwtUtil.extractUserId(accessToken);

        userService.updateUserProfile(userId, request);

        return ResponseEntity.ok("회원 정보가 수정되었습니다.");
    }

}
