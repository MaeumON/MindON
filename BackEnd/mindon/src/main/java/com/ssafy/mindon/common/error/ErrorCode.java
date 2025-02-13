package com.ssafy.mindon.common.error;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "E1", "올바르지 않은 입력값입니다."),
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "E2", "잘못된 HTTP 메서드를 호출했습니다."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "E3", "서버 에러가 발생했습니다."),
    NOT_FOUND(HttpStatus.NOT_FOUND, "E4", "존재하지 않는 엔티티입니다."),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "U1", "존재하지 않는 아이디입니다."),
    INVALID_PASSWORD(HttpStatus.UNAUTHORIZED, "U2", "비밀번호가 일치하지 않습니다."),
    INVALID_REFRESH_TOKEN(HttpStatus.UNAUTHORIZED, "U3", "유효하지 않은 리프레시 토큰입니다."),
    EXPIRED_ACCESS_TOKEN(HttpStatus.UNAUTHORIZED, "U4", "엑세스 토큰이 만료되었습니다."),
    ACCOUNT_SUSPENDED(HttpStatus.FORBIDDEN, "U5", "계정이 정지되었습니다."),
    INVALID_MEETING_ID(HttpStatus.BAD_REQUEST, "M1", "유효하지 않은 meetingId입니다."),
    MEETING_NOT_FOUND(HttpStatus.NOT_FOUND, "M2", "해당 미팅을 찾을 수 없습니다."),
    GROUP_NOT_FOUND(HttpStatus.NOT_FOUND, "G1", "유효하지 않은 groupId 입니다."),
    ONGOING_MEETING_NOT_FOUND(HttpStatus.NOT_FOUND, "M3", "해당 groupId에 대한 진행 중인 미팅이 존재하지 않습니다."),
    MEETING_Question_NOT_FOUND(HttpStatus.NOT_FOUND, "M4", "질문의 수가 충분하지 않습니다."),
    VIDEO_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "O1", "OpenVidu 서버에서 오류가 발생했습니다."),
    SESSION_NOT_FOUND(HttpStatus.NOT_FOUND, "O2", "해당 세션을 찾을 수 없습니다."),
    INVALID_SESSION_TOKEN(HttpStatus.UNAUTHORIZED, "O3", "유효하지 않은 세션 토큰입니다."),
    GROUP_CREATION_FAILED(HttpStatus.BAD_REQUEST, "G2", "그룹 생성에 실패했습니다."),
    GROUP_JOIN_SAME_TIME(HttpStatus.BAD_REQUEST, "G3", "동일한 시간에 가입된 그룹이 있어 그룹 가입에 실패했습니다."),
    GROUP_FULL(HttpStatus.BAD_REQUEST, "G4", "그룹 정원이 초과되어 그룹 가입에 실패했습니다."),
    USER_NOT_IN_GROUP(HttpStatus.BAD_REQUEST, "G5", "그룹에 해당 회원이 가입되어 있지 않아 탈퇴할 수 없습니다.");


    private final String message;
    private final String code;
    private final HttpStatus status;

    ErrorCode(final HttpStatus status, final String code, final String message) {
        this.message = message;
        this.code = code;
        this.status = status;
    }
}
