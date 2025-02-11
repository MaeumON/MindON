package com.ssafy.mindon.common.exception;

import com.ssafy.mindon.common.error.ErrorCode;
import lombok.Getter;
@Getter
public class GroupException extends BusinessBaseException{
    public GroupException(ErrorCode errorCode) {
        super(errorCode);
    }
}
