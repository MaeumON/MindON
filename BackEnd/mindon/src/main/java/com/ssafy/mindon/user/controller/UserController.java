package com.ssafy.mindon.user.controller;

import com.ssafy.mindon.auth.service.AuthService;
import com.ssafy.mindon.user.dto.*;
import com.ssafy.mindon.user.service.UserService;
import com.ssafy.mindon.video.service.VideoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.ssafy.mindon.common.util.JwtUtil;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
        jwtUtil.validateToken(accessToken);
        String userId = jwtUtil.extractUserId(accessToken);

        UserEmotionResponseDto responseDto  = userService.calculateUserEmotionScore(userId);
        return ResponseEntity.ok(responseDto );

    }

    @PatchMapping("/delete")
    public ResponseEntity<?> deleteUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String accessToken) {
        jwtUtil.validateToken(accessToken);

        String userId = jwtUtil.extractUserId(accessToken);
        userService.deleteUser(userId);

        return ResponseEntity.ok("회원 탈퇴가 완료되었습니다.");
    }

    @GetMapping("/{groupId}/list")
    public ResponseEntity<?> getSpeakerList(@PathVariable Integer groupId) throws Exception {
        String id = String.valueOf(groupId);
        Set<String> speakerIds = videoService.getParticipants(id);
        SpeakerListDto speakerListDto = userService.getSpeakerList(groupId,speakerIds);

        return ResponseEntity.ok(speakerListDto);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponseDto> getUserProfile(@RequestHeader("Authorization") String accessToken) {
        jwtUtil.validateToken(accessToken);

        String userId = jwtUtil.extractUserId(accessToken);
        
        // 사용자 정보 조회
        UserProfileResponseDto userProfile = userService.getUserProfile(userId);

        return ResponseEntity.ok(userProfile);
    }

    @PatchMapping("/profile")
    public ResponseEntity<?> updateUserProfile(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String accessToken,
            @RequestBody UserProfileUpdateRequestDto request) {
        jwtUtil.validateToken(accessToken);

        String userId = jwtUtil.extractUserId(accessToken);

        userService.updateUserProfile(userId, request);

        return ResponseEntity.ok("회원 정보가 수정되었습니다.");
    }

    @GetMapping("/reportlist")
    public ResponseEntity<?> getReportedUsers(@RequestHeader(HttpHeaders.AUTHORIZATION) String accessToken) {
        // 토큰 검증
        jwtUtil.validateToken(accessToken);

        // 신고된 유저 목록 조회
        List<ReportedUserResponseDto> reportedUsers = userService.getReportedUsers();

        return ResponseEntity.ok(reportedUsers);
    }
}
