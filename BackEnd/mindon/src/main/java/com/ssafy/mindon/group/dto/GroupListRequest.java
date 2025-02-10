package com.ssafy.mindon.group.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class GroupListRequest {
    private String keyword;
    private List<Byte> diseaseId;
    private Boolean isHost;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
    private LocalDateTime startDate;
    private Byte period;
    private Byte startTime;
    private Byte endTime;
    private List<Byte> dayOfWeek;
}
