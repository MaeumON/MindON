package com.ssafy.mindon.meeting.controller;

import com.ssafy.mindon.common.error.ErrorCode;
import com.ssafy.mindon.common.exception.AuthException;
import com.ssafy.mindon.common.exception.MeetingException;
import com.ssafy.mindon.meeting.dto.UpcomingMeetingResponseDto;
import com.ssafy.mindon.common.util.JwtUtil;
import com.ssafy.mindon.meeting.service.MeetingService;
import com.ssafy.mindon.question.dto.QuestionDto;
import com.ssafy.mindon.question.dto.QuestionsResponseDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
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
        if (meetingId <= 0) {
            throw new MeetingException(ErrorCode.INVALID_MEETING_ID);
        }

        List<QuestionDto> questions = meetingService.getMeetingQuestions(meetingId);
        return ResponseEntity.ok(new QuestionsResponseDto(questions));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<?> getUpcomingMeeting(@RequestHeader(HttpHeaders.AUTHORIZATION) String accessToken){

        if (jwtUtil.isTokenExpired(accessToken)) {
            throw new AuthException(ErrorCode.EXPIRED_ACCESS_TOKEN);
        }
        String userId = jwtUtil.extractUserId(accessToken);
        UpcomingMeetingResponseDto upcomingMeetingDto = meetingService.getUpcomingMeetingDto(userId);
        return ResponseEntity.ok(upcomingMeetingDto);

    }


    @GetMapping("/ongoing/{groupId}")
    public ResponseEntity<?> getOngoingMeetingId(@PathVariable Integer groupId) {
        try {
            if (groupId <= 0) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Bad Request", "message", "유효하지 않은 groupId입니다."));
            }

            Integer ongoingMeetingId = meetingService.getOngoingMeetingId(groupId);
            if (ongoingMeetingId == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Not Found", "message", "진행 중인 미팅이 없습니다."));
            }

            return ResponseEntity.ok(Map.of("meetingId", ongoingMeetingId));
        } catch (Exception e) {
            log.error("진행 중인 미팅 조회 중 오류 발생: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error", "message", "서버 내부 오류가 발생했습니다."));
        }
    }
}
