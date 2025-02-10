package com.ssafy.mindon.meeting.controller;

import com.ssafy.mindon.meeting.domain.UserReview;
import com.ssafy.mindon.meeting.dto.UpcomingMeetingResponseDto;
import com.ssafy.mindon.common.util.JwtUtil;
import com.ssafy.mindon.meeting.service.MeetingService;
import com.ssafy.mindon.question.dto.QuestionDto;
import com.ssafy.mindon.question.dto.QuestionsResponseDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/meetings")
@RequiredArgsConstructor
public class MeetingController {

    private final JwtUtil jwtUtil;
    private final MeetingService meetingService;

    @GetMapping("/{meetingId}/questions")
    public ResponseEntity<?> getQuestions(@PathVariable Integer meetingId) {
        try {
            if (meetingId <= 0) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Bad Request", "message", "유효하지 않은 meetingId입니다."));
            }

            List<QuestionDto> questions = meetingService.getMeetingQuestions(meetingId);
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

    @GetMapping("/upcoming")
    public ResponseEntity<?> getUpcomingMeeting(@RequestHeader(HttpHeaders.AUTHORIZATION) String accessToken){

        try{
            String userId = jwtUtil.extractUserId(accessToken);
            if(userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid Token","message","유효하지 않은 accessToken 입니다."));
            }
            UpcomingMeetingResponseDto upcomingMeetingDto = meetingService.getUpcomingMeetingDto(userId);
            if (upcomingMeetingDto == null) {
                System.out.println("비었음.");
                return ResponseEntity.ok(Collections.singletonMap("data", upcomingMeetingDto));
            }

            return ResponseEntity.ok(Map.of("data",upcomingMeetingDto));
        }  catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error", "message", e.getMessage()));
        }
    }
}
