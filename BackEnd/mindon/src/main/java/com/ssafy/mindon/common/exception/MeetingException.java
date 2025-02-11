package com.ssafy.mindon.common.exception;

import com.ssafy.mindon.common.error.ErrorCode;
import lombok.Getter;
@Getter
public class MeetingException extends BusinessBaseException {
    public MeetingException(ErrorCode errorCode) {
        super(errorCode);
    }
}
