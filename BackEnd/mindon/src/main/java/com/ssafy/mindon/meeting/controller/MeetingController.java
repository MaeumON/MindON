package com.ssafy.mindon.meeting.controller;

import com.ssafy.mindon.common.error.ErrorCode;
import com.ssafy.mindon.common.exception.AuthException;
import com.ssafy.mindon.common.exception.GroupException;
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
        jwtUtil.validateToken(accessToken);
        String userId = jwtUtil.extractUserId(accessToken);

        UpcomingMeetingResponseDto upcomingMeetingDto = meetingService.getUpcomingMeetingDto(userId);
        return ResponseEntity.ok(upcomingMeetingDto);

    }


    @GetMapping("/ongoing/{groupId}")
    public ResponseEntity<?> getOngoingMeetingId(@PathVariable Integer groupId) {
        if (groupId <= 0) {
            throw new GroupException(ErrorCode.GROUP_NOT_FOUND);
        }

        Integer ongoingMeetingId = meetingService.getOngoingMeetingId(groupId);
        if (ongoingMeetingId == null) {
            throw new MeetingException(ErrorCode.ONGOING_MEETING_NOT_FOUND);
        }
        return ResponseEntity.ok(Map.of("meetingId", ongoingMeetingId));
    }
}
