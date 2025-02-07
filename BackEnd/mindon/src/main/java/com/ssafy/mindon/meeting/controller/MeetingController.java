package com.ssafy.mindon.meeting.controller;

import com.ssafy.mindon.meeting.domain.UserReview;
import com.ssafy.mindon.meeting.service.MeetingAnalysisService;
import com.ssafy.mindon.common.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/meetings")
@RequiredArgsConstructor
public class MeetingController {

    private final MeetingAnalysisService meetingAnalysisService;
    private final JwtUtil jwtUtil;

    /**
     * 사용자의 미팅 분석 요청을 처리
     */
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

            // 요청 데이터에서 감정 및 발화량 정보 추출
            Number emotionNumber = (Number) requestBody.get("emotion");
            Integer speechAmount = (Integer) requestBody.get("speechAmount");

            // emotion 값을 안전하게 변환 - byte로
            byte emotion = (emotionNumber != null) ? emotionNumber.byteValue() : 0;

            // STT 데이터를 기반으로 분석 & 저장
            UserReview userReview = meetingAnalysisService.analyzeAndSaveReview(userId, meetingId, emotion, speechAmount);

            // 결과 응답 반환
            return ResponseEntity.ok(Map.of(
                    "data", Map.of(
                            "date", java.time.LocalDate.now().toString(),
                            "meetingWeek", userReview.getMeetingWeek(),
                            "summation", userReview.getSummation(),
                            "cheeringMessage", userReview.getCheeringMessage()
                    )
            ));

        } catch (IllegalArgumentException e) {
            log.warn(" [BAD REQUEST] {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Bad Request", "message", e.getMessage()));

        } catch (Exception e) {
            log.error(" [INTERNAL SERVER ERROR] ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error", "message", e.getMessage()));
        }
    }
}
