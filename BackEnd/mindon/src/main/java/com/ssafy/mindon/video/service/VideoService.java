package com.ssafy.mindon.video.service;

import com.ssafy.mindon.group.repository.GroupRepository;
import io.openvidu.java.client.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.ssafy.mindon.group.entity.Group;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.Map;
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
            System.out.println(params);
            SessionProperties properties = SessionProperties.fromJson(params).build();
            Session session = openvidu.createSession(properties);
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

            RecordingProperties properties = new RecordingProperties.Builder()
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
}
