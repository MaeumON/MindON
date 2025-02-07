package com.ssafy.mindon.meeting.service;

import com.ssafy.mindon.meeting.entity.Meeting;
import com.ssafy.mindon.meeting.repository.MeetingRepository;
import com.ssafy.mindon.question.dto.QuestionDto;
import com.ssafy.mindon.question.repository.QuestionRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MeetingQuestionService {

    private final MeetingRepository meetingRepository;
    private final QuestionRepository questionRepository;

    public List<QuestionDto> getMeetingQuestions(Integer meetingId) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new EntityNotFoundException("Meeting not found"));

        byte meetingWeek = meeting.getMeetingWeek();
        byte period = meeting.getGroup().getPeriod();

        List<QuestionDto> questions = new ArrayList<>();

        // 시작 메시지 추가
        questions.add(new QuestionDto(100, "안녕하세요. 간단하게 오늘의 다짐을 말해볼까요??"));

        // 중간 질문들 가져오기
        List<QuestionDto> middleQuestions;
        if (meetingWeek == 1) {
            middleQuestions = questionRepository.findFirst3ByCurriculumWeekOrderByQuestionId((byte) 1);
        } else if (meetingWeek == period || meetingWeek == 8) {
            middleQuestions = questionRepository.findFirst3ByCurriculumWeekOrderByQuestionId((byte) 3);
        } else {
            // 중간 주 로직
            List<QuestionDto> allQuestions = questionRepository.findByCurriculumWeekOrderByQuestionId((byte) 2);

            if (allQuestions.size() < 21) {  // 최소 21개 체크
                throw new RuntimeException("Not enough questions for curriculum week 2. Minimum 21 required.");
            }

            int totalMiddleWeeks = (period == 8) ? 6 : (period - 2);
            int questionsPerWeek = allQuestions.size() / totalMiddleWeeks;

            int startIndex = (meetingWeek - 2) * questionsPerWeek;
            int endIndex = (meetingWeek - 1) * questionsPerWeek;

            if (meetingWeek == totalMiddleWeeks + 1) {
                endIndex = allQuestions.size();
            }

            List<QuestionDto> weekQuestions = allQuestions.subList(startIndex, endIndex);
            Collections.shuffle(weekQuestions);
            middleQuestions = weekQuestions.stream()
                    .limit(3)
                    .collect(Collectors.toList());
        }

        questions.addAll(middleQuestions);
        questions.add(new QuestionDto(101, "오늘 모임에 대한 소감을 말해볼까요?"));
        return questions;
    }
}
