package com.ssafy.mindon.userreview.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GroupReviewResponseDto {
    private Integer emotionAvg;
    private List<ReviewData> data;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class ReviewData {
        private Integer meetingId;
        private String userId;
        private Byte emotionId;
        private String summation;
        private String cheeringMessage;
        private Integer speechAmount;
        private LocalDateTime date;
        private Byte period;
        private Byte progressWeeks;
        private Byte meetingWeek;
    }
}
