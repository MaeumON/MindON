package com.ssafy.mindon.common.error;

import com.ssafy.mindon.common.exception.AuthException;
import com.ssafy.mindon.common.exception.BusinessBaseException;
import com.ssafy.mindon.common.exception.GroupException;
import com.ssafy.mindon.common.exception.NotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Slf4j
@ControllerAdvice // 모든 컨트롤러에서 발생하는 예외를 잡아서 처리
public class GlobalExceptionHandler {
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class) // HttpRequestMethodNotSupportedException 예외를 잡아서 처리
    protected ResponseEntity<ErrorResponse> handle(HttpRequestMethodNotSupportedException e) {
        log.error("HttpRequestMethodNotSupportedExecption", e);
        return createErrorResponseEntity(ErrorCode.METHOD_NOT_ALLOWED);
    }

    @ExceptionHandler(BusinessBaseException.class)
    protected ResponseEntity<ErrorResponse> handle(BusinessBaseException e) {
        log.error("BusinessException", e);
        return createErrorResponseEntity(e.getErrorCode());
    }

    @ExceptionHandler(Exception.class)
    protected ResponseEntity<ErrorResponse> handle(Exception e) {
        log.error("Exception", e);
        return createErrorResponseEntity(ErrorCode.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(AuthException.class)
    protected ResponseEntity<ErrorResponse> handle(AuthException e) {
        log.error("AuthException", e);
        return createErrorResponseEntity(e.getErrorCode());
    }

    @ExceptionHandler(GroupException.class)
    protected ResponseEntity<ErrorResponse> handle(GroupException e) {
        log.error("GroupException", e);
        return createErrorResponseEntity(e.getErrorCode());
    }

    @ExceptionHandler(NotFoundException.class)
    protected ResponseEntity<ErrorResponse> handle(NotFoundException e) {
        log.error("NotFoundException", e);
        return createErrorResponseEntity(e.getErrorCode());
    }

    private ResponseEntity<ErrorResponse> createErrorResponseEntity(ErrorCode errorCode) {
        return new ResponseEntity<>(
                ErrorResponse.of(errorCode),
                errorCode.getStatus());
    }


}
