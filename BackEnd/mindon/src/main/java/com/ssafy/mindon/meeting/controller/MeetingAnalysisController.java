package com.ssafy.mindon.meeting.controller;

import com.ssafy.mindon.meeting.service.OpenAIService;
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

    private final OpenAIService openAIService;

    @PostMapping("/{meetingId}/analysis")
    public ResponseEntity<?> analyzeMeeting(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String accessToken,
            @PathVariable String meetingId,
            @RequestBody Map<String, Object> requestBody) {

        Integer emotion = (Integer) requestBody.get("emotion");
        Map<String, Object> textData = (Map<String, Object>) requestBody.get("textData");

        String textContent = textData != null ? (String) textData.get("content") : "제공된 텍스트 없음";

        // GPT에게 전달하는 내용인데 테스트해보면서 수정하면 될 듯!
        String summationPrompt = "사용자의 감정 상태는 " + emotion + " 입니다. 제공된 텍스트 데이터를 100자에서 150자 사이로 요약해주세요: " + textContent;
        String encouragementPrompt = "사용자의 감정 상태는 " + emotion + " 입니다. 제공된 텍스트를 바탕으로 감정을 건들 수 있는 응원글 3문장을 작성해주세요: " + textContent;

        try {
            String summation = openAIService.getChatGPTResponse(summationPrompt);
            String cheeringMessage = openAIService.getChatGPTResponse(encouragementPrompt);

            Map<String, Object> response = Map.of(
                    "data", Map.of(
                            "date", java.time.LocalDate.now().toString(),
                            "meetingWeek", requestBody.get("meetingWeek"),
                            "progressWeeks", requestBody.get("progressWeeks"),
                            "summation", summation,
                            "cheeringMessage", cheeringMessage
                    )
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error", "message", e.getMessage()));
        }
    }
}
