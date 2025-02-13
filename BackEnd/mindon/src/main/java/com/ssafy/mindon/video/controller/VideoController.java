package com.ssafy.mindon.video.controller;

import com.ssafy.mindon.common.error.ErrorCode;
import com.ssafy.mindon.common.exception.AuthException;
import com.ssafy.mindon.common.util.JwtUtil;
import com.ssafy.mindon.video.dto.SessionResponse;
import com.ssafy.mindon.video.service.VideoService;
import io.openvidu.java.client.Recording;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/video")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequiredArgsConstructor
public class VideoController {

    private final VideoService videoService;
    private final JwtUtil jwtUtil;

    // 세션 API
    @PostMapping("/sessions")
    public ResponseEntity<SessionResponse> initializeSession(@RequestHeader("Authorization") String accessToken, @RequestBody(required = false) Map<String, Object> params) {
        jwtUtil.validateToken(accessToken);
        String customSessionId = (String) params.get("customSessionId");
        String userId = jwtUtil.extractUserId(accessToken);
        SessionResponse response = videoService.initializeSession(params);
        videoService.addParticipant(customSessionId, userId);

        return new ResponseEntity<>(response, HttpStatus.OK);

    }

    @PostMapping("/sessions/{sessionId}/connections")
    public ResponseEntity<String> createConnection(@RequestHeader("Authorization") String accessToken, @PathVariable("sessionId") String sessionId,
                                                   @RequestBody(required = false) Map<String, Object> params) {
        jwtUtil.validateToken(accessToken);
        String token = videoService.createConnection(sessionId, params);
        return new ResponseEntity<>(token, HttpStatus.OK);
    }

    @PostMapping("/remove-user")
    public ResponseEntity<?> removeUser(@RequestHeader("Authorization") String accessToken, @RequestBody Map<String, Object> sessionNameToken) {
        jwtUtil.validateToken(accessToken);
        videoService.removeUser(sessionNameToken);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("close-session")
    public ResponseEntity<?> closeSession(@RequestHeader("Authorization") String accessToken, @RequestBody Map<String, Object> sessionName) {
        jwtUtil.validateToken(accessToken);
        videoService.closeSession(sessionName);
        return new ResponseEntity<>(HttpStatus.OK);
    }


    // 녹음 API
    @PostMapping("/recording/start")
    public ResponseEntity<?> startRecording(@RequestHeader("Authorization") String accessToken, @RequestBody Map<String, Object> params) {
        jwtUtil.validateToken(accessToken);
        Recording recording = videoService.startRecording((String) params.get("session"), params);
        return new ResponseEntity<>(recording, HttpStatus.OK);
    }


    @PostMapping("/recording/stop")
    public ResponseEntity<?> stopRecording(@RequestHeader("Authorization") String accessToken, @RequestBody Map<String, Object> params) {
        jwtUtil.validateToken(accessToken);
        String userId = jwtUtil.extractUserId(accessToken);
        String sessionId = (String) params.get("recording");
        int questionId = (Integer) params.get("questionId");
        Recording recording = videoService.stopRecording(sessionId);
        String url = recording.getUrl();
        videoService.saveRecording(url, sessionId, userId, questionId);
        videoService.deleteRecording(sessionId);
        // 비동기 STT 작업 추가
        videoService.processRecordingAsync(sessionId, userId, questionId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/recording/delete")
    public ResponseEntity<?> deleteRecording(@RequestHeader("Authorization") String accessToken, @RequestBody Map<String, Object> params) {
        jwtUtil.validateToken(accessToken);
        videoService.deleteRecording((String) params.get("recording"));
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/sessions/{sessionId}/participants")
    public ResponseEntity<Set<String>> getParticipants(@PathVariable("sessionId") String sessionId) {
        Set<String> participants = videoService.getParticipants(sessionId);
        return new ResponseEntity<>(participants, HttpStatus.OK);
    }

}
