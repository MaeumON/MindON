package com.ssafy.mindon.meeting.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "user_review")
@IdClass(UserReviewId.class)  // 복합 키 적용
public class UserReview {

    @Id
    @Column(name = "user_id", length = 10, nullable = false)
    private String userId;

    @Id
    @Column(name = "meeting_id", nullable = false)
    private Integer meetingId;

    @Column(name = "meeting_week", nullable = false)
    private Integer meetingWeek;

    @Column(name = "summation", columnDefinition = "TEXT", nullable = false)
    private String summation;

    @Column(name = "cheering_message", columnDefinition = "TEXT", nullable = false)
    private String cheeringMessage;

    @Column(name = "speech_amount", nullable = false)
    private Integer speechAmount = 0;

    @Column(name = "emotion_id", nullable = false)
    private Byte emotionId;

}
