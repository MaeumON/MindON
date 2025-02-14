package com.ssafy.mindon.video.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SessionResponseDto {
    private String sessionId;
    private boolean isHost;
}
