package com.ssafy.mindon.common.error;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "E1", "올바르지 않은 입력값입니다."),
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "E2", "잘못된 HTTP 메서드를 호출했습니다."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "E3", "서버 에러가 발생했습니다."),
    NOT_FOUND(HttpStatus.NOT_FOUND, "E4", "존재하지 않는 엔티티입니다."),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "U1", "User not found"),
    INVALID_PASSWORD(HttpStatus.UNAUTHORIZED, "U2", "Invalid password"),
    INVALID_REFRESH_TOKEN(HttpStatus.UNAUTHORIZED, "U3", "Invalid refresh token");


    private final String message;

    private final String code;
    private final HttpStatus status;
    ErrorCode(final HttpStatus status, final String code, final String message) {
        this.message = message;
        this.code = code;
        this.status = status;
    }
}
