package com.ssafy.mindon.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequestDto {
    private String userId;  // 사용자 ID
    private String userName;  // 사용자 이름
    private String email;  // 이메일
    private String password;  // 비밀번호
    private String phone;  // 전화번호
    private Byte diseaseId;  // 질병 ID
}