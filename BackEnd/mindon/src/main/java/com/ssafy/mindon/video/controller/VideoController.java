package com.ssafy.mindon.video.controller;

import com.ssafy.mindon.video.dto.SessionResponse;
import com.ssafy.mindon.video.service.VideoService;
import io.openvidu.java.client.Recording;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/video")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class VideoController {

    private final VideoService videoService;

    @Autowired
    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }

    // 세션 생성
    @PostMapping("/sessions")
    public ResponseEntity<SessionResponse> initializeSession(@RequestBody(required = false) Map<String, Object> params) {
        try {
            String sessionId = videoService.initializeSession(params);
            boolean isHost = videoService.isHostGroup(sessionId);
            Map<String, Object> response = new HashMap<>();
            response.put("customSessionId", sessionId);
            response.put("isHost", isHost);

            return new ResponseEntity<>(new SessionResponse(sessionId, isHost), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/sessions/{sessionId}/connections")
    public ResponseEntity<String> createConnection(@PathVariable("sessionId") String sessionId,
                                                   @RequestBody(required = false) Map<String, Object> params) {
        try {
            String token = videoService.createConnection(sessionId, params);
            return new ResponseEntity<>(token, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/recording/start")
    public ResponseEntity<?> startRecording(@RequestBody Map<String, Object> params) {
        try {
            Recording recording = videoService.startRecording((String) params.get("session"), params);
            return new ResponseEntity<>(recording, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/recording/stop")
    public ResponseEntity<?> stopRecording(@RequestBody Map<String, Object> params) {
        try {
            Recording recording = videoService.stopRecording((String) params.get("recording"));
            return new ResponseEntity<>(recording, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/recording/delete")
    public ResponseEntity<?> deleteRecording(@RequestBody Map<String, Object> params) {
        try {
            videoService.deleteRecording((String) params.get("recording"));
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/recording/get/{recordingId}")
    public ResponseEntity<?> getRecording(@PathVariable(value = "recordingId") String recordingId) {
        try {
            Recording recording = videoService.getRecording(recordingId);
            return new ResponseEntity<>(recording, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/recording/list")
    public ResponseEntity<?> listRecordings() {
        try {
            List<Recording> recordings = videoService.listRecordings();
            return new ResponseEntity<>(recordings, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
