package com.ssafy.mindon.meeting.controller;

import com.ssafy.mindon.meeting.domain.UserReview;
import com.ssafy.mindon.meeting.service.MeetingAnalysisService;
import com.ssafy.mindon.common.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/meetings")
@RequiredArgsConstructor
public class MeetingAnalysisController {

    private final MeetingAnalysisService meetingAnalysisService;
    private final JwtUtil jwtUtil;  // accessToken에서 userId 추출할 때 사용

    @PostMapping("/{meetingId}/analysis")
    public ResponseEntity<?> analyzeMeeting(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String accessToken,
            @PathVariable Integer meetingId,
            @RequestBody Map<String, Object> requestBody) {

        try {
            // accessToken에서 userId 추출
            String userId = jwtUtil.extractUserId(accessToken);
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid Token", "message", "유효하지 않은 accessToken입니다."));
            }

            // 요청 데이터 추출
            // emotion 값을 안전하게 변환 - byte로
            Number emotionNumber = (Number) requestBody.get("emotion");
            byte emotion = (emotionNumber != null) ? emotionNumber.byteValue() : 0;
            Integer speechAmount = (Integer) requestBody.get("speechAmount"); // 프론트에서 전달
            String voiceFile = (String) requestBody.get("voiceFile"); // 텍스트 파일 내용

            if (voiceFile == null || voiceFile.isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Bad Request", "message", "voiceFile이 비어 있습니다."));
            }

            // AI 분석 및 DB 저장 실행
            UserReview userReview = meetingAnalysisService.analyzeAndSaveReview(
                    userId, meetingId, emotion, speechAmount, voiceFile
            );

            // 응답 반환
            Map<String, Object> response = Map.of(
                    "data", Map.of(
                            "date", java.time.LocalDate.now().toString(),
                            "meetingWeek", userReview.getMeetingWeek(),
                            "summation", userReview.getSummation(),
                            "cheeringMessage", userReview.getCheeringMessage()
                    )
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error", "message", e.getMessage()));
        }
    }
}
