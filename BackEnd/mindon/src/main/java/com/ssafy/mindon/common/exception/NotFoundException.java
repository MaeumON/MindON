package com.ssafy.mindon.common.exception;

import com.ssafy.mindon.common.error.ErrorCode;

public class NotFoundException extends BusinessBaseException {

    public NotFoundException(ErrorCode errorCode) {
        super(errorCode.getMessage(), errorCode);
    }

    public NotFoundException() {
        super(ErrorCode.NOT_FOUND);
    }
}
