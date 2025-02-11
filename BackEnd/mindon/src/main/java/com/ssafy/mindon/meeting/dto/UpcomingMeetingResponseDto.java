package com.ssafy.mindon.meeting.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;


@Getter
@Builder
@AllArgsConstructor
public class UpcomingMeetingResponseDto {
    private String title;
    private Integer groupId;
    private Integer meetingTime;
    private Integer diseaseId;
    private String diseaseName;
    private LocalDateTime meetingDate;
    private Byte meetingStatus;
}