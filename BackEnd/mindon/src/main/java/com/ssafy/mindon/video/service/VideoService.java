package com.ssafy.mindon.video.service;

import com.ssafy.mindon.common.error.ErrorCode;
import com.ssafy.mindon.common.exception.VideoException;
import com.ssafy.mindon.group.repository.GroupRepository;
import com.ssafy.mindon.group.service.GroupService;
import com.ssafy.mindon.stt.service.AudioConverterService;
import com.ssafy.mindon.stt.service.SpeechToTextService;
import com.ssafy.mindon.video.dto.SessionResponseDto;
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
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class VideoService {

    @Value("${openvidu.url}")
    private String OPENVIDU_URL;

    @Value("${openvidu.secret}")
    private String OPENVIDU_SECRET;

    @Value("${recording.directory}")
    private String recordingDirectory;

    private OpenVidu openvidu;
    private final GroupService groupService;
    private final AudioConverterService audioConverterService;
    private final SpeechToTextService speechToTextService;

    // 세션 이름과 OpenVidu Session 객체를 매핑하는 컬렉션
    private Map<String, Session> mapSessions = new ConcurrentHashMap<>();
    // 세션 이름과 토큰 및 역할을 매핑하는 컬렉션
    private Map<String, Map<String, OpenViduRole>> mapSessionNamesTokens = new ConcurrentHashMap<>();
    // 세션 아이디와 참여자 유저 아이디 목록을 저장하는 컬렉션
    private Map<String, Set<String>> sessionParticipants = new ConcurrentHashMap<>();
    // No-argument constructor is needed for Spring to instantiate the bean
    @Autowired
    public VideoService(AudioConverterService audioConverterService, SpeechToTextService speechToTextService, GroupService groupService) {
        this.audioConverterService = audioConverterService;
        this.speechToTextService = speechToTextService;
        this.groupService = groupService;
    }

    @PostConstruct
    private void init() {
        if (OPENVIDU_URL == null || OPENVIDU_SECRET == null) {
            throw new IllegalStateException("OpenVidu URL and Secret are required");
        }
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    public SessionResponseDto initializeSession(Map<String, Object> params) {
        try {
            SessionProperties properties = SessionProperties.fromJson(params).build();
            Session session = openvidu.createSession(properties);

            // mapSessions에 세션 저장
            mapSessions.put(session.getSessionId(), session);
            String sessionId = session.getSessionId();
            boolean isHost = groupService.isHostGroup(session.getSessionId());

            return new SessionResponseDto(sessionId, isHost);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw new VideoException(ErrorCode.VIDEO_SERVER_ERROR);
        }
    }

    public String createConnection(String sessionId, Map<String, Object> params){
        try {
            Session session = openvidu.getActiveSession(sessionId);
            if (session == null) {
                throw new VideoException(ErrorCode.SESSION_NOT_FOUND);
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
            throw new VideoException(ErrorCode.VIDEO_SERVER_ERROR);
        }
    }

    public void removeUser(Map<String, Object> sessionNameToken) {
        try {
            String sessionName = (String) sessionNameToken.get("sessionName");
            String token = (String) sessionNameToken.get("token");
            Session session = this.mapSessions.get(sessionName);
            // 세션이 존재하는 경우
            if (this.mapSessions.get(sessionName) != null && this.mapSessionNamesTokens.get(sessionName) != null) {

                // 토큰이 존재하는 경우
                if (this.mapSessionNamesTokens.get(sessionName).remove(token) != null) {

                    // 참여자 목록에서 유저 제거
                    Set<String> participants = sessionParticipants.get(sessionName);
                    if (participants != null) {
                        participants.removeIf(userId -> userId.equals(token)); // 토큰과 일치하는 유저 제거
                        if (participants.isEmpty()) {
                            sessionParticipants.remove(sessionName); // 모든 유저가 나가면 목록 삭제
                        }
                    }

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
                    throw new VideoException(ErrorCode.INVALID_SESSION_TOKEN);
                }

            } else {
                // 세션이 존재하지 않는 경우
                throw new VideoException(ErrorCode.SESSION_NOT_FOUND);
            }
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw new VideoException(ErrorCode.VIDEO_SERVER_ERROR);
        }
    }

    public void closeSession(Map<String, Object> sessionName) {
        try {
            // 요청에서 세션 이름 가져오기
            String session = (String) sessionName.get("sessionName");

            // 세션이 존재하는 경우
            if (this.mapSessions.get(session) != null && this.mapSessionNamesTokens.get(session) != null) {
                Session s = this.mapSessions.get(session);
                // 세션의 모든 참여자 정보 삭제
                sessionParticipants.remove(session);
                mapSessionNamesTokens.get(session).clear();
                s.close();
                this.mapSessions.remove(session);
                this.mapSessionNamesTokens.remove(session);
            } else {
                // 세션이 존재하지 않는 경우
                throw new VideoException(ErrorCode.SESSION_NOT_FOUND);
            }
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw new VideoException(ErrorCode.VIDEO_SERVER_ERROR);
        }
    }

    public Recording startRecording(String sessionId, Map<String, Object> params) {
        try {
            Recording.OutputMode outputMode = Recording.OutputMode.valueOf((String) params.get("outputMode"));
            boolean hasAudio = (boolean) params.get("hasAudio");
            boolean hasVideo = (boolean) params.get("hasVideo");
            String uuid = UUID.randomUUID().toString().replaceAll("-", ""); // UUID에서 "-" 제거
            String randomString = uuid.substring(0, 5); // 앞 5자리만 사용

            RecordingProperties properties = new RecordingProperties.Builder()
                    .name(randomString)
                    .outputMode(outputMode)
                    .hasAudio(hasAudio)
                    .hasVideo(hasVideo)
                    .build();

            return openvidu.startRecording(sessionId, properties);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw new VideoException(ErrorCode.VIDEO_SERVER_ERROR);
        }
    }

    public Recording stopRecording(String recordingId) {
        try {
            return openvidu.stopRecording(recordingId);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw new VideoException(ErrorCode.VIDEO_SERVER_ERROR);
        }
    }

    public void deleteRecording(String recordingId) {
        try {
            openvidu.deleteRecording(recordingId);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw new VideoException(ErrorCode.VIDEO_SERVER_ERROR);
        }
    }

    public void saveRecording(String url, String sessionId, String userId, int questionId) {
        try {
            // URL에서 파일 다운로드
            URL fileUrl = new URL(url);
            InputStream in = fileUrl.openStream();

            // 확장자 추출
            String fileExtension = url.substring(url.lastIndexOf("."));

            String fileName = sessionId + "_" + userId + "_" + questionId + fileExtension;
            Path filePath = Paths.get(recordingDirectory, fileName);

            // 디렉토리 존재하지 않으면 생성
            Files.createDirectories(Paths.get(recordingDirectory));

            // 파일 저장
            Files.copy(in, filePath, StandardCopyOption.REPLACE_EXISTING);
            in.close();

        } catch (Exception e) {
            throw new VideoException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    @Async
    public void processRecordingAsync(String sessionId, String userId, int questionId) {
        try {
            String filePath = recordingDirectory + sessionId + "_" + userId + "_" + questionId + ".webm";

            // WebM → WAV 변환
            String wavPath = audioConverterService.convertWebMToWav(filePath);

            // WAV → STT 변환 및 저장
            File wavFile = new File(wavPath);
            speechToTextService.convertAndSaveSTT(wavFile, sessionId, userId, questionId);

        } catch (Exception e) {
            // 로깅 및 디버깅을 위한 상세 정보 출력
            throw new VideoException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    // 세션에 참여자를 추가하는 메소드
    public void addParticipant(String sessionId, String userId){
        Session session = this.mapSessions.get(sessionId);
        if (session == null) {
            throw new VideoException(ErrorCode.SESSION_NOT_FOUND);
        }

        // 세션에 해당하는 참여자 목록을 가져오거나 새로 생성
        Set<String> participants = sessionParticipants.getOrDefault(sessionId, new HashSet<>());
        participants.add(userId);

        // 세션 아이디에 해당하는 참여자 목록 저장
        sessionParticipants.put(sessionId, participants);
    }

    // 세션의 참여자 명단을 반환하는 메소드
    public Set<String> getParticipants(String sessionId) {
        Set<String> participants = sessionParticipants.get(sessionId);
        if (participants == null) {
            throw new VideoException(ErrorCode.SESSION_NOT_FOUND);
        }
        return participants;
    }
}
