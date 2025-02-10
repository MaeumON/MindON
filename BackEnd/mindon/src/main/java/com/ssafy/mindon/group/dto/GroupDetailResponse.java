package com.ssafy.mindon.group.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GroupDetailResponse {
    private boolean registered;
    private Integer groupId;
    private String title;
    private Byte diseaseId;
    private String diseaseName;
    private String description;
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
    private Byte progressWeeks;
}
