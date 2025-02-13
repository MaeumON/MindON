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
        List<Stt> sttList = sttRepository.findByMeetingMeetingId(meetingId);
        if (sttList.isEmpty()) {
            throw new IllegalArgumentException("No STT data found for meeting");
        }
        int totalSpeechTime = sttList.stream().mapToInt(Stt::getSpeechTime).sum();

        List<Stt> userSttList = sttRepository.findByUserUserIdAndMeetingMeetingId(userId, meetingId);
        if (userSttList.isEmpty()) {
            throw new IllegalArgumentException("No STT data found for user and meeting");
        }
        int userTotalSpeechTime = userSttList.stream().mapToInt(Stt::getSpeechTime).sum();

        // speechAmount 계산 (0으로 나눔 방지) -> %로 저장
        int speechAmount = totalSpeechTime > 0 ? (userTotalSpeechTime * 100 / totalSpeechTime) : 0;


        // 5. STT 데이터로 질문과 답변 텍스트 결합
        String combined = userSttList.stream()
                .map(stt -> {
                    String questionDetail = (stt.getQuestion() != null) ? stt.getQuestion().getDetail() : "질문 없음";
                    return "질문: " + questionDetail + " 답변: " + stt.getText();
                })
                .collect(Collectors.joining(" "));

        // 모든 줄바꿈 문자(\n, \r) 제거
        String combinedQA = combined.replaceAll("[\\n\\r]", "");

        // 6. ChatGPT 프롬프트 생성 및 요청
        String summationPrompt = "다음은 사용자가 특정 상황에서 했던 대화 내용입니다. 이 내용을 기반으로 **100~150자 내외로 요약문을 작성**해 주세요. 📌 요약 규칙:- 핵심적인 질문과 답변 내용을 담아야 합니다.- 사용자의 감정 상태(예: 기뻐요, 행복해요, 뿌듯해요, 평온해요, 슬퍼요, 불안해요, 피곤해요, 화나요 등)는 요약에 포함되지 않습니다.- 문장은 간결하고 명확해야 합니다.- 불필요한 감탄사나 주관적인 감정 표현을 배제하고 객관적으로 요약하세요. 📌 대화 내용:"+ combinedQA + "📌 예시 출력: 치료로 인해 피로감이 지속되지만, 작은 목표를 세우며 일상 속에서 긍정적인 변화를 만들어 가고 있습니다.";

        String cheeringPrompt = "다음은 사용자의 대화 내용입니다. 이 요약을 참고하여, 사용자의 감정 상태에 맞는 **응원 메시지를 1문장!!**으로 작성해 주세요. 📌 응원 규칙: - 사용자의 감정 상태(예: 기뻐요, 행복해요, 뿌듯해요, 평온해요, 슬퍼요, 불안해요, 피곤해요, 화나요 등)에 따라 다르게 작성해야 합니다. - 지나치게 감정적이거나 과장된 표현을 피하고 진정성 있는 응원을 작성하세요. - 단순한 위로보다는 사용자가 **스스로 힘을 낼 수 있도록 동기부여**하는 방향으로 작성하세요. 📌 사용자의 감정 상태: " + emotion.getEmotion() + " 📌 대화 내용: " + combinedQA + " 📌 예시 출력: '어려운 상황에서도 해결책을 고민하는 모습이 인상적이에요. 지금처럼 차근차근 나아가면 분명 좋은 결과가 있을 거예요!' '힘든 시간을 보내고 있지만, 당신의 노력과 성장은 분명 가치 있는 일이에요. 자신을 믿고 조금씩 나아가 봐요.' '좋은 결과를 만들어 가고 있네요! 지금의 긍정적인 에너지를 유지하면서 더 큰 성장을 기대해봐요!'";

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
