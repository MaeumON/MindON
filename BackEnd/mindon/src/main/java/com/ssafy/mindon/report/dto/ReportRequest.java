package com.ssafy.mindon.report.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportRequest {
    private String reportedUserId;
    private Integer reasonId;
    private String reason;
    private Integer meetingId;
}