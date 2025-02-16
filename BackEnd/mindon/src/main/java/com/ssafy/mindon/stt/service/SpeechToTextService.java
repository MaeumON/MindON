package com.ssafy.mindon.stt.service;

import com.google.cloud.speech.v1.*;
import com.google.protobuf.ByteString;
import com.ssafy.mindon.question.entity.Question;
import com.ssafy.mindon.stt.entity.Stt;
import com.ssafy.mindon.stt.entity.SttId;
import com.ssafy.mindon.stt.repository.SttRepository;
import com.ssafy.mindon.meeting.repository.MeetingRepository;
import com.ssafy.mindon.question.repository.QuestionRepository;
import com.ssafy.mindon.user.entity.User;
import com.ssafy.mindon.user.repository.UserRepository;
import com.ssafy.mindon.meeting.entity.Meeting;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.UnsupportedAudioFileException;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

@Service
@RequiredArgsConstructor
public class SpeechToTextService {

    private static final Logger logger = LoggerFactory.getLogger(SpeechToTextService.class);

    private final SttRepository sttRepository;
    private final MeetingRepository meetingRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;

    /**
     * WAV 파일을 STT 변환하고 저장
     *
     * @param audioFile 변환할 오디오 파일 (WAV)
     * @param sessionId 세션 ID
     * @param userId    사용자 ID
     * @param questionId 질문 ID
     * @throws IOException 파일 처리 실패
     */
    public void convertAndSaveSTT(File audioFile, String sessionId, String userId, int questionId) throws IOException {
        logger.info("STT 변환 시작: sessionId={}, userId={}, questionId={}", sessionId, userId, questionId);

        // 1. 오디오 파일 읽기
        ByteString audioBytes = ByteString.copyFrom(Files.readAllBytes(audioFile.toPath()));

        // 2. Google STT 설정
        RecognitionConfig config = createRecognitionConfig();
        RecognitionAudio audio = createRecognitionAudio(audioBytes);

        // 3. WAV 파일의 길이를 초 단위로 계산
        int speechTime = getAudioDurationInSeconds(audioFile);
        logger.info("음성 파일 길이: {} 초", speechTime);

        try (SpeechClient speechClient = SpeechClient.create()) {
            // 4. Google STT 요청
            RecognizeResponse response = speechClient.recognize(config, audio);

            // 5. 변환된 텍스트 처리
            String transcribedText = extractTranscription(response);

            // 6. Meeting ID 조회
            int meetingId = findMeetingId(sessionId);

            // 7. STT 데이터 저장 (speechTime 포함)
            saveSttData(meetingId, userId, questionId, transcribedText, speechTime);

            logger.info("STT 변환 및 저장 성공: sessionId={}, userId={}, questionId={}, speechTime={}",
                    sessionId, userId, questionId, speechTime);

        } catch (Exception e) {
            logger.error("STT 변환 중 오류 발생: 파일 경로={}, sessionId={}, userId={}, questionId={}",
                    audioFile.getPath(), sessionId, userId, questionId, e);
            throw new IOException("STT 변환 실패: " + e.getMessage(), e);
        } finally {
            // 작업 후 WAV 파일 삭제 로직
            try {
                if (audioFile.exists() && Files.deleteIfExists(audioFile.toPath())) {
                    logger.info("WAV 파일 삭제 성공: {}", audioFile.getAbsolutePath());
                } else {
                    logger.warn("WAV 파일이 존재하지 않거나 삭제할 수 없습니다: {}", audioFile.getAbsolutePath());
                }
            } catch (IOException deletionEx) {
                logger.error("WAV 파일 삭제 중 예외 발생: {}", audioFile.getAbsolutePath(), deletionEx);
            }
        }
    }

    private RecognitionConfig createRecognitionConfig() {
        return RecognitionConfig.newBuilder()
                .setEncoding(RecognitionConfig.AudioEncoding.LINEAR16) // WAV 지원
                .setSampleRateHertz(16000) // 16kHz 샘플링 레이트 (Google STT에 최적화)
                .setLanguageCode("ko-KR") // 한국어 설정
                .build();
    }

    private RecognitionAudio createRecognitionAudio(ByteString audioBytes) {
        return RecognitionAudio.newBuilder()
                .setContent(audioBytes)
                .build();
    }

    private String extractTranscription(RecognizeResponse response) {
        StringBuilder transcription = new StringBuilder();
        for (SpeechRecognitionResult result : response.getResultsList()) {
            transcription.append(result.getAlternatives(0).getTranscript());
        }
        return transcription.toString().trim();
    }

    private int findMeetingId(String sessionId) {
        return meetingRepository.findByGroup_GroupIdAndMeetingStatus(Integer.parseInt(sessionId), 1) // 진행 중인 모임 (meetingStatus==1)
                .map(Meeting::getMeetingId)
                .orElseThrow(() -> new IllegalArgumentException("해당 sessionId와 meeting_status에 대한 meeting_id를 찾을 수 없습니다: " + sessionId));
    }

    /**
     * WAV 파일의 길이를 초 단위로 계산
     */
    private int getAudioDurationInSeconds(File audioFile) throws IOException {
        try (AudioInputStream audioInputStream = AudioSystem.getAudioInputStream(audioFile)) {
            AudioFormat format = audioInputStream.getFormat();
            long audioFileLength = audioFile.length();
            int frameSize = format.getFrameSize();
            float frameRate = format.getFrameRate();

            return (int) (audioFileLength / (frameSize * frameRate));
        } catch (UnsupportedAudioFileException e) {
            throw new IOException("지원되지 않는 오디오 파일 형식: " + e.getMessage(), e);
        }
    }

    private void saveSttData(int meetingId, String userId, int questionId, String transcribedText, int speechTime) {
        SttId sttId = new SttId();
        sttId.setUserId(userId);
        sttId.setMeetingId(meetingId);
        sttId.setQuestionId(questionId);

        // Meeting 객체 조회
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new IllegalArgumentException("Meeting ID에 해당하는 Meeting 객체를 찾을 수 없습니다: " + meetingId));

        // Question 객체 조회
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("Question ID에 해당하는 Question 객체를 찾을 수 없습니다: " + questionId));

        // User 객체 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User ID에 해당하는 User 객체를 찾을 수 없습니다: " + userId));

        // Stt 객체 생성 및 데이터 설정
        Stt stt = new Stt();
        stt.setId(sttId);
        stt.setMeeting(meeting);
        stt.setQuestion(question);
        stt.setUser(user);
        stt.setText(transcribedText);
        stt.setSpeechTime(speechTime); // 음성 길이 저장

        // Stt 저장
        sttRepository.save(stt);
    }
}