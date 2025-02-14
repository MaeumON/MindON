package com.ssafy.mindon.user.dto;
import lombok.Getter;
import lombok.Setter;
import lombok.Builder;

@Getter
@Setter
@Builder
public class ReportedUserResponseDto {
    private String userId;    // 사용자 ID
    private String userName;  // 사용자 이름
}
