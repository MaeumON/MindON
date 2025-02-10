package com.ssafy.mindon.userreview.controller;

import com.ssafy.mindon.userreview.entity.UserReview;
import com.ssafy.mindon.userreview.service.UserReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/userreview")
@RequiredArgsConstructor
public class UserReviewController {

    private final UserReviewService userReviewService;

    @PostMapping("/{meetingId}/emotions")
    public ResponseEntity<?> recordEmotionAndAnalyze(
            @RequestHeader("Authorization") String accessToken,
            @PathVariable Integer meetingId,
            @RequestBody Map<String, Object> requestBody) {

        // 요청 데이터에서 emotionId 추출
        if (!requestBody.containsKey("emotionId")) {
            return ResponseEntity.badRequest().body(Map.of("message", "emotionId is required"));
        }

        Byte emotionId = ((Number) requestBody.get("emotionId")).byteValue();

        // analyzeAndSaveReview 호출
        UserReview userReview = userReviewService.analyzeAndSaveReview(accessToken, meetingId, emotionId);

        // 성공 응답 반환
        return ResponseEntity.ok(Map.of(
                "message", "Emotion recorded and analysis completed"
        ));
    }
}
