package com.ssafy.mindon.common.exception;

import com.ssafy.mindon.common.error.ErrorCode;
import lombok.Getter;

@Getter
public class AuthException extends BusinessBaseException {
    public AuthException(ErrorCode errorCode) {
        super(errorCode);
    }
}
