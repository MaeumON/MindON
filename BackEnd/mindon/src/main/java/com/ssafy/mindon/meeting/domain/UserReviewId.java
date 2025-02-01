package com.ssafy.mindon.meeting.domain;

import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class UserReviewId implements Serializable {
    private String userId;
    private Integer meetingId;
}
