package com.ssafy.mindon.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequestDto {
    private String userId;  // 사용자 ID
    private String password;  // 비밀번호
}
