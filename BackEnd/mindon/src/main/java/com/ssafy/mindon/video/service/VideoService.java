package com.ssafy.mindon.video.service;

import io.openvidu.java.client.*;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class VideoService {

    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;

    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

    private OpenVidu openvidu;
    private final Map<String, Boolean> sessionRecordings = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    public Optional<String> initializeSession(Map<String, Object> params) throws OpenViduJavaClientException, OpenViduHttpException {
        SessionProperties properties = SessionProperties.fromJson(params).build();
        Session session = openvidu.createSession(properties);
        return Optional.of(session.getSessionId());
    }

    public Optional<String> createConnection(String sessionId, Map<String, Object> params) throws OpenViduJavaClientException, OpenViduHttpException {
        Session session = openvidu.getActiveSession(sessionId);
        if (session == null) {
            return Optional.empty();
        }
        ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
        Connection connection = session.createConnection(properties);
        return Optional.of(connection.getToken());
    }

    public Optional<Recording> startRecording(Map<String, Object> params) {
        try {
            String sessionId = (String) params.get("session");
            Recording.OutputMode outputMode = Recording.OutputMode.valueOf((String) params.get("outputMode"));
            boolean hasAudio = (boolean) params.get("hasAudio");
            boolean hasVideo = (boolean) params.get("hasVideo");

            RecordingProperties properties = new RecordingProperties.Builder()
                    .outputMode(outputMode)
                    .hasAudio(hasAudio)
                    .hasVideo(hasVideo)
                    .build();

            Recording recording = openvidu.startRecording(sessionId, properties);
            sessionRecordings.put(sessionId, true);
            return Optional.of(recording);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Optional<Recording> stopRecording(String recordingId) {
        try {
            Recording recording = openvidu.stopRecording(recordingId);
            sessionRecordings.remove(recording.getSessionId());
            return Optional.of(recording);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public boolean deleteRecording(String recordingId) {
        try {
            openvidu.deleteRecording(recordingId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Optional<Recording> getRecording(String recordingId) {
        try {
            return Optional.of(openvidu.getRecording(recordingId));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Optional<List<Recording>> listRecordings() {
        try {
            return Optional.of(openvidu.listRecordings());
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
