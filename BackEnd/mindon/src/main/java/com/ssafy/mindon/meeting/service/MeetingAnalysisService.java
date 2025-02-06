package com.ssafy.mindon.meeting.service;

import com.ssafy.mindon.emotion.entity.Emotion;
import com.ssafy.mindon.emotion.repository.EmotionRepository;
import com.ssafy.mindon.meeting.domain.UserReview;
import com.ssafy.mindon.meeting.repository.UserReviewRepository;
import com.ssafy.mindon.stt.entity.Stt;
import com.ssafy.mindon.meeting.entity.Meeting;
import com.ssafy.mindon.stt.repository.SttRepository;
import com.ssafy.mindon.meeting.repository.MeetingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MeetingAnalysisService {

    private final OpenAIService openAIService;
    private final UserReviewRepository userReviewRepository;
    private final SttRepository sttRepository;
    private final EmotionRepository emotionRepository;
    private final MeetingRepository meetingRepository;

    public UserReview analyzeAndSaveReview(String userId, Integer meetingId, Byte emotionId, Integer speechAmount) {

        // meetings 테이블에서 meetingWeek 값 조회
        Optional<Meeting> meetingOptional = meetingRepository.findById(meetingId);
        Byte meetingWeek = meetingOptional.map(Meeting::getMeetingWeek).orElse((byte) 0);

        // Emotion 테이블에서 감정 조회
        Optional<Emotion> emotionOptional = emotionRepository.findById(emotionId);
        String emotion = emotionOptional.map(Emotion::getEmotion).orElse("기본");

        // STT 테이블에서 userId와 meetingId에 해당하는 모든 레코드 조회
        List<Stt> sttList = sttRepository.findByUserIdAndMeetingId(userId, meetingId);

        if (sttList.isEmpty()) {
            throw new IllegalArgumentException("분석할 STT 데이터가 없습니다.");
        }

        log.info("조회된 STT 데이터 개수: {}", sttList.size());

        // STT 질문과 답변을 매칭하여 문자열로 결합
        String combinedQA = sttList.stream()
                .map(stt -> {
                    String questionDetail = (stt.getQuestion() != null) ? stt.getQuestion().getDetail() : "질문 없음";
                    return "질문: " + questionDetail + " 답변: " + stt.getText();
                })
                .collect(Collectors.joining(" "));

        // AI 요청을 위한 프롬프트 생성
        System.out.println("emotion"+emotion);
        System.out.println("combinedQA"+combinedQA);
        String summationPrompt = "사용자의 감정 상태는 '" + emotion + "' 입니다. 아래 대화 내용을 100자에서 150자로 요약해 주세요: " + combinedQA;
        String cheeringPrompt = "사용자의 감정 상태는 '" + emotion + "' 입니다. 위 대화 내용 요약을 참고하여 응원 메시지를 1문장 작성해 주세요.";

        // AI 분석 실행
        String summation = openAIService.getChatGPTResponse(summationPrompt);
        String cheeringMessage = openAIService.getChatGPTResponse(cheeringPrompt);

        log.info("AI 분석 완료: 요약={}, 응원 메시지={}", summation, cheeringMessage);

        // `UserReview` 객체 생성 및 저장
        UserReview userReview = UserReview.builder()
                .userId(userId)
                .meetingId(meetingId)
                .meetingWeek(meetingWeek)  // 미팅 주차 (추후 로직에서 설정 가능)
                .summation(summation)
                .cheeringMessage(cheeringMessage)
                .speechAmount(speechAmount)
                .emotionId(emotionId)
                .build();

        return userReviewRepository.save(userReview);
    }
}
