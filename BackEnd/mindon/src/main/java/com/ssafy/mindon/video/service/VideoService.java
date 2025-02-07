package com.ssafy.mindon.video.service;

import com.ssafy.mindon.group.repository.GroupRepository;
import io.openvidu.java.client.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

    // Collection to pair session names and recording objects
    private Map<String, Boolean> sessionRecordings = new ConcurrentHashMap<>();
    // No-argument constructor is needed for Spring to instantiate the bean
    @Autowired
    public VideoService(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
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
            String groupId = (String) params.get("customSessionId");
            SessionProperties properties = SessionProperties.fromJson(params).build();
            Session session = openvidu.createSession(properties);
//            // 세션에 연결된 모든 참가자의 연결 정보를 가져오는 코드
//            List<Connection> connections = session.getConnections();
//            System.out.println("세션 정보: " + session);
//            System.out.println("연결 정보: " + connections);  // 참가자(연결) 정보 출력
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
            return connection.getToken();
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw new Exception("Error creating connection: " + e.getMessage());
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
}
