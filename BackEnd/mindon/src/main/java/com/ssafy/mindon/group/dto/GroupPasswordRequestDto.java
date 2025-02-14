package com.ssafy.mindon.group.dto;

import lombok.Data;

@Data
public class GroupPasswordRequestDto {
    private Integer groupId;
    private String privatePassword;
}
