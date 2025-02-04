package com.ssafy.mindon.openvidu.service;

import com.google.cloud.speech.v1.*;
import com.google.protobuf.ByteString;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class SpeechToTextService {

    @Value("${google.credentials.file}") // application.yml에서 Google 키 파일 경로 가져오기
    private String credentialsFilePath;

    @PostConstruct
    public void init() {
        // Google Cloud 키 파일 경로를 환경 변수로 설정
        System.setProperty("GOOGLE_APPLICATION_CREDENTIALS", credentialsFilePath);
    }

    public String convertSpeechToText(String filePath) throws Exception {
        Path path = Paths.get(filePath);
        byte[] data = Files.readAllBytes(path);
        return processAudioData(data);
    }

    public String convertSpeechToText(InputStream inputStream) throws Exception {
        byte[] data = inputStream.readAllBytes(); // InputStream 데이터를 바이트 배열로 읽기
        return processAudioData(data);
    }

    private String processAudioData(byte[] audioData) throws Exception {
        try (SpeechClient speechClient = SpeechClient.create()) {
            ByteString audioBytes = ByteString.copyFrom(audioData);

            // 음성 인식 요청 설정
            RecognitionConfig config = RecognitionConfig.newBuilder()
                    .setEncoding(RecognitionConfig.AudioEncoding.FLAC) // FLAC 파일 인코딩
                    .setLanguageCode("ko-KR") // 한국어로 설정
                    .setSampleRateHertz(48000) // 샘플 레이트 설정
                    .build();
            RecognitionAudio audio = RecognitionAudio.newBuilder()
                    .setContent(audioBytes)
                    .build();

            // 음성 인식 요청 및 결과 처리
            RecognizeResponse response = speechClient.recognize(config, audio);
            StringBuilder transcription = new StringBuilder();
            for (SpeechRecognitionResult result : response.getResultsList()) {
                SpeechRecognitionAlternative alternative = result.getAlternativesList().get(0);
                transcription.append(alternative.getTranscript()).append("\n");
            }
            return transcription.toString().trim();
        }
    }
}