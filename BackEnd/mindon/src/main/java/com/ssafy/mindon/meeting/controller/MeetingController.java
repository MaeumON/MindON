package com.ssafy.mindon.meeting.controller;

import com.ssafy.mindon.meeting.service.MeetingQuestionService;
import com.ssafy.mindon.question.dto.QuestionDto;
import com.ssafy.mindon.question.dto.QuestionsResponseDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/meetings")
@RequiredArgsConstructor
public class MeetingController {
 
    private final MeetingQuestionService meetingQuestionService;

    @GetMapping("/{meetingId}/questions")
    public ResponseEntity<?> getQuestions(@PathVariable Integer meetingId) {
        try {
            if (meetingId <= 0) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Bad Request", "message", "유효하지 않은 meetingId입니다."));
            }

            List<QuestionDto> questions = meetingQuestionService.getMeetingQuestions(meetingId);
            return ResponseEntity.ok(new QuestionsResponseDto(questions));

        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Not Found", "message", "해당 미팅을 찾을 수 없습니다."));
        } catch (Exception e) {
            log.error("미팅 질문 조회 중 오류 발생: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error", "message", "서버 내부 오류가 발생했습니다."));
        }
    }
}
