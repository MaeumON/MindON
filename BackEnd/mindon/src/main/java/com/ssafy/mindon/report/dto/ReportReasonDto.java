package com.ssafy.mindon.report.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReportReasonDto {
    private Integer reasonId;
    private String reasonName;
    private String reason;
}
