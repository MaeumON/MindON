package com.ssafy.mindon.video.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SessionResponse {
    private String sessionId;
    private boolean isHost;
}
