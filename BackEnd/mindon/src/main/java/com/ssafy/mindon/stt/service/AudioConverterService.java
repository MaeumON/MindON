package com.ssafy.mindon.stt.service;

import org.springframework.stereotype.Service;
import java.io.*;

@Service
public class AudioConverterService {

    private static final String FFMPEG_PATH = "ffmpeg"; // FFmpeg 실행 경로 (환경 변수 등록됨)
    private static final String OUTPUT_DIRECTORY = "C://recordings/"; // 변환된 파일 저장 디렉토리

    /**
     * WebM 파일을 WAV 형식으로 변환
     *
     * @param inputPath WebM 파일 경로
     * @return 변환된 WAV 파일 경로
     * @throws IOException 변환 실패 시 예외 발생
     */
    public String convertWebMToWav(String inputPath) throws IOException {
        File inputFile = new File(inputPath);
        if (!inputFile.exists()) {
            throw new IOException("입력 파일이 존재하지 않습니다: " + inputPath);
        }

        // 변환될 WAV 파일 경로 설정
        String outputFileName = inputFile.getName().replace(".webm", ".wav");
        String outputPath = OUTPUT_DIRECTORY + outputFileName;

        // FFmpeg 명령어 실행
        ProcessBuilder processBuilder = new ProcessBuilder(
                FFMPEG_PATH,
                "-i", "\"" + inputPath + "\"", // 파일명 공백 대비 처리
                "-vn",                 // 비디오 제외
                "-ac", "1",            // 오디오 채널 (모노)
                "-ar", "16000",        // 샘플 레이트 (16kHz) (STT에 최적화)
                "-c:a", "pcm_s16le",   // WAV 오디오 코덱 지정 (16-bit PCM)
                "\"" + outputPath + "\"" // 출력 파일 경로도 공백 대비 처리
        );

        processBuilder.redirectErrorStream(true); // 오류 메시지를 출력으로 포함
        Process process = processBuilder.start();

        // FFmpeg 실행 로그 확인
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println("FFmpeg: " + line);
            }
        }

        // 변환 완료 대기
        try {
            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new IOException("FFmpeg 변환 실패: " + exitCode);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IOException("FFmpeg 실행 중 인터럽트 발생", e);
        }

        return outputPath;
    }
}
