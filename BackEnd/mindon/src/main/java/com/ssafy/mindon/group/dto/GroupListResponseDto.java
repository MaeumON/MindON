package com.ssafy.mindon.group.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class GroupListResponseDto {
    private Integer groupId;
    private String title;
    private Byte diseaseId;
    private String diseaseName;
    private Boolean isPrivate;
    private String privatePassword;
    private String inviteCode;
    private Boolean isHost;
    private LocalDateTime startDate;
    private Byte period;
    private Byte meetingTime;
    private Byte dayOfWeek;
    private Byte minMember;
    private Byte maxMember;
    private Byte totalMember;
    private Byte groupStatus;
}
