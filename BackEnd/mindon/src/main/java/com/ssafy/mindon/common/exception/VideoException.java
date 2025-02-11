package com.ssafy.mindon.common.exception;

import com.ssafy.mindon.common.error.ErrorCode;
import lombok.Getter;

@Getter
public class VideoException extends BusinessBaseException {
    public VideoException(ErrorCode errorCode) {
        super(errorCode);
    }
}
