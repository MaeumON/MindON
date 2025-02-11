package com.ssafy.mindon.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
@Getter
@AllArgsConstructor
public class UserEmotionResponseDto {
    private int avgEmotion;  // 감정 평균
    private int exitGroup;   // 종료된 그룹 수
}
