package com.ssafy.mindon.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserSpeechAmount {
    private String userId;
    private Double avgSpeechAmount;
}
