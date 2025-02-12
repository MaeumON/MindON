package com.ssafy.mindon.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileResponseDto {
    private String userId;
    private String userName;
    private String phone;
    private Byte diseaseId;
    private String diseaseName;
}
