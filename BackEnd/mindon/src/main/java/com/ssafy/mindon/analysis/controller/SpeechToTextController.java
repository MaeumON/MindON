package com.ssafy.mindon.analysis.controller;

import com.ssafy.mindon.analysis.service.SpeechToTextService;
import com.ssafy.mindon.common.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.Map;

@RestController
@RequestMapping("/api/meetings")
@RequiredArgsConstructor
public class SpeechToTextController {

    private final SpeechToTextService speechToTextService;
    private final JwtUtil jwtUtil; // accessToken에서 userId 추출할 때 사용

    @PostMapping("/{meetingId}/stt")
    public ResponseEntity<?> convertSpeechToText(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String accessToken,
            @RequestParam("file") MultipartFile file) {
        try {
            // accessToken에서 userId 추출
            String userId = jwtUtil.extractUserId(accessToken);
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid Token", "message", "유효하지 않은 accessToken입니다."));
            }

            // 음성 파일 검증
            if (file == null || file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Bad Request", "message", "음성 파일이 비어 있습니다."));
            }

            // 음성 파일에서 텍스트 추출
            InputStream fileInputStream = file.getInputStream();
            String transcribedText = speechToTextService.convertSpeechToText(fileInputStream);
            if (transcribedText == null || transcribedText.isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Bad Request", "message", "음성 파일 변환 실패."));
            }

            return ResponseEntity.ok(Map.of("transcribedText", transcribedText));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error", "message", e.getMessage()));
        }
    }
}