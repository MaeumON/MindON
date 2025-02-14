package com.ssafy.mindon.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserSpeechAmountDto {
    private String userId;
    private Double avgSpeechAmount;
}
