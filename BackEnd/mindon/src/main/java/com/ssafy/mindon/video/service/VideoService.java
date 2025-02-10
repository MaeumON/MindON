package com.ssafy.mindon.video.service;

import com.ssafy.mindon.group.repository.GroupRepository;
import com.ssafy.mindon.stt.service.AudioConverterService;
import com.ssafy.mindon.stt.service.SpeechToTextService;
import io.openvidu.java.client.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import com.ssafy.mindon.group.entity.Group;
import java.io.*;
import java.net.URL;
import java.nio.file.*;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class VideoService {

    @Value("${openvidu.url}")
    private String OPENVIDU_URL;

    @Value("${openvidu.secret}")
    private String OPENVIDU_SECRET;

    private OpenVidu openvidu;
    private final GroupRepository groupRepository;
    private final AudioConverterService audioConverterService;
    private final SpeechToTextService speechToTextService;

    // 세션 이름과 OpenVidu Session 객체를 매핑하는 컬렉션
    private Map<String, Session> mapSessions = new ConcurrentHashMap<>();
    // 세션 이름과 토큰 및 역할을 매핑하는 컬렉션
    private Map<String, Map<String, OpenViduRole>> mapSessionNamesTokens = new ConcurrentHashMap<>();
    // 세션 이름과 녹화 상태를 매핑하는 컬렉션
    private Map<String, Boolean> sessionRecordings = new ConcurrentHashMap<>();
    // No-argument constructor is needed for Spring to instantiate the bean
    @Autowired
    public VideoService(GroupRepository groupRepository, AudioConverterService audioConverterService, SpeechToTextService speechToTextService) {
        this.groupRepository = groupRepository;
        this.audioConverterService = audioConverterService;
        this.speechToTextService = speechToTextService;
    }

    @PostConstruct
    private void init() {
        if (OPENVIDU_URL == null || OPENVIDU_SECRET == null) {
            throw new IllegalStateException("OpenVidu URL and Secret are required");
        }
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    public String initializeSession(Map<String, Object> params) throws Exception {
        try {
            SessionProperties properties = SessionProperties.fromJson(params).build();
            Session session = openvidu.createSession(properties);

            // mapSessions에 세션 저장
            mapSessions.put(session.getSessionId(), session);

            return session.getSessionId();
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw new Exception("Error initializing session: " + e.getMessage());
        }
    }

    public String createConnection(String sessionId, Map<String, Object> params) throws Exception {
        try {
            Session session = openvidu.getActiveSession(sessionId);
            if (session == null) {
                throw new Exception("Session not found");
            }
            ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
            Connection connection = session.createConnection(properties);

            // 세션 이름과 토큰 및 역할을 mapSessionNamesTokens에 저장
            String sessionName = session.getSessionId();
            OpenViduRole role = properties.getRole();
            Map<String, OpenViduRole> tokens = mapSessionNamesTokens.getOrDefault(sessionName, new ConcurrentHashMap<>());
            tokens.put(connection.getToken(), role);
            mapSessionNamesTokens.put(sessionName, tokens);

            return connection.getToken();
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw new Exception("Error creating connection: " + e.getMessage());
        }
    }

    public void removeUser(Map<String, Object> sessionNameToken) throws Exception{
        String sessionName = (String) sessionNameToken.get("sessionName");
        String token = (String) sessionNameToken.get("token");
        System.out.println("세션 이름: " + sessionName + ", 토큰: " + token);
        Session session = this.mapSessions.get(sessionName);
        // 세션이 존재하는 경우
        if (this.mapSessions.get(sessionName) != null && this.mapSessionNamesTokens.get(sessionName) != null) {

            // 토큰이 존재하는 경우
            if (this.mapSessionNamesTokens.get(sessionName).remove(token) != null) {
                List<Connection> activeConnections = session.getConnections();
                for (Connection connection : activeConnections) {
                    if (connection.getToken().equals(token)) {
                        session.forceDisconnect(connection); // 세션에 입장한 사용자 연결 끊기
                    }
                }
                // 마지막 사용자가 나간 경우 세션 삭제
                if (this.mapSessionNamesTokens.get(sessionName).isEmpty()) {
                    session.close();
                    this.mapSessions.remove(sessionName);
                }
            } else {
                // 유효하지 않은 토큰인 경우
                System.out.println("Problems in the app server: the TOKEN wasn't valid");
                throw new Exception("The TOKEN wasn't valid");
            }

        } else {
            // 세션이 존재하지 않는 경우
            System.out.println("Problems in the app server: the SESSION does not exist");
            throw new Exception("The SESSION does not exist");
        }
    }

    public void closeSession(Map<String, Object> sessionName) throws Exception {
        // 요청에서 세션 이름 가져오기
        String session = (String) sessionName.get("sessionName");

        // 세션이 존재하는 경우
        if (this.mapSessions.get(session) != null && this.mapSessionNamesTokens.get(session) != null) {
            Session s = this.mapSessions.get(session);
            s.close();
            this.mapSessions.remove(session);
            this.mapSessionNamesTokens.remove(session);
        } else {
            // 세션이 존재하지 않는 경우
            throw new Exception("The SESSION does not exist");
        }
    }

    public Recording startRecording(String sessionId, Map<String, Object> params) throws Exception {
        try {
            Recording.OutputMode outputMode = Recording.OutputMode.valueOf((String) params.get("outputMode"));
            boolean hasAudio = (boolean) params.get("hasAudio");
            boolean hasVideo = (boolean) params.get("hasVideo");
            String uuid = UUID.randomUUID().toString().replaceAll("-", ""); // UUID에서 "-" 제거
            String randomString = uuid.substring(0, 5); // 앞 5자리만 사용
            System.out.println(randomString);

            RecordingProperties properties = new RecordingProperties.Builder()
                    .name(randomString)
                    .outputMode(outputMode)
                    .hasAudio(hasAudio)
                    .hasVideo(hasVideo)
                    .build();

            return openvidu.startRecording(sessionId, properties);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw new Exception("Error starting recording: " + e.getMessage());
        }
    }

    public Recording stopRecording(String recordingId) throws Exception {
        try {
            return openvidu.stopRecording(recordingId);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw new Exception("Error stopping recording: " + e.getMessage());
        }
    }

    public void deleteRecording(String recordingId) throws Exception {
        try {
            openvidu.deleteRecording(recordingId);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw new Exception("Error deleting recording: " + e.getMessage());
        }
    }

    public Recording getRecording(String recordingId) throws Exception {
        try {
            return openvidu.getRecording(recordingId);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw new Exception("Error getting recording: " + e.getMessage());
        }
    }

    public List<Recording> listRecordings() throws Exception {
        try {
            return openvidu.listRecordings();
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw new Exception("Error listing recordings: " + e.getMessage());
        }
    }

    public boolean isHostGroup(String sessionId) {
        try {
            int groupId = Integer.parseInt(sessionId);
            return groupRepository.findById(groupId)
                    .map(Group::getIsHost)
                    .orElse(false); // 그룹이 없으면 기본값 false 반환
        } catch (NumberFormatException e) {
            return false; // sessionId가 숫자가 아닐 경우 false 반환
        }
    }

    public void saveRecording(String url, String sessionId, String userId, int questionId) {
        try {
            // URL에서 파일 다운로드
            URL fileUrl = new URL(url);
            InputStream in = fileUrl.openStream();

            // 확장자 추출
            String fileExtension = url.substring(url.lastIndexOf("."));

            // 로컬 저장 경로 설정 (C:/recordings)
            String directory = "C://recordings/";
            String fileName = sessionId + "_" + userId + "_" + questionId + fileExtension;
            Path filePath = Paths.get(directory, fileName);

            // 디렉토리 존재하지 않으면 생성
            Files.createDirectories(Paths.get(directory));

            // 파일 저장
            Files.copy(in, filePath, StandardCopyOption.REPLACE_EXISTING);
            in.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    public void processRecordingAsync(String sessionId, String userId, int questionId) {
        try {
            String filePath = "C:\\recordings\\" + sessionId + "_" + userId + "_" + questionId + ".webm";

            // WebM → WAV 변환
            String wavPath = audioConverterService.convertWebMToWav(filePath);

            // WAV → STT 변환 및 저장
            File wavFile = new File(wavPath);
            speechToTextService.convertAndSaveSTT(wavFile, sessionId, userId, questionId);

        } catch (Exception e) {
            // 로깅 및 디버깅을 위한 상세 정보 출력
            System.err.println("비동기 처리 중 오류 발생: sessionId=" + sessionId + ", userId=" + userId + ", questionId=" + questionId);
            e.printStackTrace();
        }
    }


}
