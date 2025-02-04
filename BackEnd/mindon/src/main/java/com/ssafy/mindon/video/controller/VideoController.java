package com.ssafy.mindon.video.controller;

import io.openvidu.java.client.*;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/video")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class VideoController {

    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;

    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

    private OpenVidu openvidu;

    // Collection to pair session names and recording objects
    private Map<String, Boolean> sessionRecordings = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    /**
     * @param params The Session properties
     * @return The Session ID
     */
    @PostMapping("/sessions")
    public ResponseEntity<String> initializeSession(@RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {
        SessionProperties properties = SessionProperties.fromJson(params).build();
        Session session = openvidu.createSession(properties);
        return new ResponseEntity<>(session.getSessionId(), HttpStatus.OK);
    }

    /**
     * @param sessionId The Session in which to create the Connection
     * @param params    The Connection properties
     * @return The Token associated to the Connection
     */
    @PostMapping("/sessions/{sessionId}/connections")
    public ResponseEntity<String> createConnection(@PathVariable("sessionId") String sessionId,
                                                   @RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {
        Session session = openvidu.getActiveSession(sessionId);
        if (session == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
        Connection connection = session.createConnection(properties);
        return new ResponseEntity<>(connection.getToken(), HttpStatus.OK);
    }

    @PostMapping("/recording/start")
    public ResponseEntity<?> startRecording(@RequestBody Map<String, Object> params) {
        String sessionId = (String) params.get("session");
        Recording.OutputMode outputMode = Recording.OutputMode.valueOf((String) params.get("outputMode"));
        boolean hasAudio = (boolean) params.get("hasAudio");
        boolean hasVideo = (boolean) params.get("hasVideo");

        RecordingProperties properties = new RecordingProperties.Builder().outputMode(outputMode).hasAudio(hasAudio)
                .hasVideo(hasVideo).build();

        System.out.println("Starting recording for session " + sessionId + " with properties {outputMode=" + outputMode
                + ", hasAudio=" + hasAudio + ", hasVideo=" + hasVideo + "}");

        try {
            Recording recording = this.openvidu.startRecording(sessionId, properties);
            this.sessionRecordings.put(sessionId, true);
            return new ResponseEntity<>(recording, HttpStatus.OK);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/recording/stop")
    public ResponseEntity<?> stopRecording(@RequestBody Map<String, Object> params) {
        String recordingId = (String) params.get("recording");

        System.out.println("Stoping recording | {recordingId}=" + recordingId);

        try {
            Recording recording = this.openvidu.stopRecording(recordingId);
            this.sessionRecordings.remove(recording.getSessionId());
            return new ResponseEntity<>(recording, HttpStatus.OK);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/recording/delete")
    public ResponseEntity<?> deleteRecording(@RequestBody Map<String, Object> params) {
        String recordingId = (String) params.get("recording");

        System.out.println("Deleting recording | {recordingId}=" + recordingId);

        try {
            this.openvidu.deleteRecording(recordingId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/recording/get/{recordingId}")
    public ResponseEntity<?> getRecording(@PathVariable(value = "recordingId") String recordingId) {

        System.out.println("Getting recording | {recordingId}=" + recordingId);

        try {
            Recording recording = this.openvidu.getRecording(recordingId);
            return new ResponseEntity<>(recording, HttpStatus.OK);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/recording/list")
    public ResponseEntity<?> listRecordings() {

        System.out.println("Listing recordings");

        try {
            List<Recording> recordings = this.openvidu.listRecordings();

            return new ResponseEntity<>(recordings, HttpStatus.OK);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}