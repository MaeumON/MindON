package com.ssafy.mindon.group.dto;

import lombok.Data;

@Data
public class GroupPasswordRequest {
    private Integer groupId;
    private String privatePassword;
}
