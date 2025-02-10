package com.ssafy.mindon.userreview.service;

import com.ssafy.mindon.common.util.JwtUtil;
import com.ssafy.mindon.emotion.entity.Emotion;
import com.ssafy.mindon.emotion.repository.EmotionRepository;
import com.ssafy.mindon.userreview.entity.UserReview;
import com.ssafy.mindon.userreview.repository.UserReviewRepository;
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

@Service
@RequiredArgsConstructor
public class UserReviewService {

    private final OpenAIService openAIService;
    private final UserReviewRepository userReviewRepository;
    private final SttRepository sttRepository;
    private final EmotionRepository emotionRepository;
    private final MeetingRepository meetingRepository;
    private final JwtUtil jwtUtil; // JWT 유틸리티를 사용하여 userId 추출

    public UserReview analyzeAndSaveReview(String accessToken, Integer meetingId, Byte emotionId) {
        // 1. JWT에서 userId 추출
        String userId = jwtUtil.extractUserId(accessToken);

        // 2. meetings 테이블에서 meeting_week 값 조회
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));
        Byte meetingWeek = meeting.getMeetingWeek();

        // 3. emotionId 값 Emotion 테이블에서 조회
        Emotion emotion = emotionRepository.findById(emotionId)
                .orElseThrow(() -> new RuntimeException("Emotion not found"));

        // 4. STT 데이터 합산 계산
        List<Stt> sttList = sttRepository.findByMeetingId(meetingId);
        if (sttList.isEmpty()) {
            throw new IllegalArgumentException("No STT data found for meeting");
        }
        int totalSpeechTime = sttList.stream().mapToInt(Stt::getSpeechTime).sum();

        List<Stt> userSttList = sttRepository.findByUserIdAndMeetingId(userId, meetingId);
        if (userSttList.isEmpty()) {
            throw new IllegalArgumentException("No STT data found for user and meeting");
        }
        int userTotalSpeechTime = userSttList.stream().mapToInt(Stt::getSpeechTime).sum();

        // speechAmount 계산 (0으로 나눔 방지) -> %로 저장
        int speechAmount = totalSpeechTime > 0 ? (userTotalSpeechTime * 100 / totalSpeechTime) : 0;


        // 5. STT 데이터로 질문과 답변 텍스트 결합
        String combinedQA = sttList.stream()
                .map(stt -> {
                    String questionDetail = (stt.getQuestion() != null) ? stt.getQuestion().getDetail() : "질문 없음";
                    return "질문: " + questionDetail + " 답변: " + stt.getText();
                })
                .collect(Collectors.joining(" "));

        // 6. ChatGPT 프롬프트 생성 및 요청
        String summationPrompt = "사용자의 감정 상태는 '" + emotion.getEmotion() + "' 입니다. 아래 대화 내용을 100자에서 150자로 요약해 주세요: " + combinedQA;
        String cheeringPrompt = "사용자의 감정 상태는 '" + emotion.getEmotion() + "' 입니다. 위 대화 내용 요약을 참고하여 응원 메시지를 1문장 작성해 주세요.";

        String summation = openAIService.getChatGPTResponse(summationPrompt);
        String cheeringMessage = openAIService.getChatGPTResponse(cheeringPrompt);

        // 7. UserReview 엔티티 생성 및 저장
        UserReview userReview = UserReview.builder()
                .userId(userId)
                .meetingId(meetingId)
                .meetingWeek(meetingWeek)
                .summation(summation)
                .cheeringMessage(cheeringMessage)
                .speechAmount(speechAmount)
                .emotionId(emotionId)
                .build();

        return userReviewRepository.save(userReview);
    }
}
