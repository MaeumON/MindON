package com.ssafy.mindon.meeting.service;

import com.ssafy.mindon.meeting.domain.UserReview;
import com.ssafy.mindon.meeting.repository.UserReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MeetingAnalysisService {

    private final OpenAIService openAIService;
    private final UserReviewRepository userReviewRepository;

    public UserReview analyzeAndSaveReview(String userId, Integer meetingId, Byte emotion, Integer speechAmount, String voiceFileContent) {

        // AI 요청 내용 (텍스트 파일 내용을 활용)
        String summationPrompt = "사용자의 감정 상태는 " + emotion + " 입니다. 주어진 텍스트 파일 내용을 100자에서 150자로 요약해주세요: " + voiceFileContent;
        String encouragementPrompt = "사용자의 감정 상태는 " + emotion + " 입니다. 주어진 텍스트 파일 내용을 기반으로 응원 메시지를 1문장 작성해주세요: " + voiceFileContent;

        // GPT 응답 받기
        String summation = openAIService.getChatGPTResponse(summationPrompt);
        String cheeringMessage = openAIService.getChatGPTResponse(encouragementPrompt);

        // UserReview 엔티티 생성 및 저장
        UserReview userReview = UserReview.builder()
                .userId(userId)
                .meetingId(meetingId)
                .meetingWeek(1)  // 임시 값 (추후 로직에서 설정 필요)
                .summation(summation)
                .cheeringMessage(cheeringMessage)
                .speechAmount(speechAmount)  // 프론트에서 전달한 값 사용
                .emotionId(emotion)
                .build();

        return userReviewRepository.save(userReview); // DB에 저장
    }
}
