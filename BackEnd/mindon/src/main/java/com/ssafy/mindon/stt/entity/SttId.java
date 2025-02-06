package com.ssafy.mindon.stt.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@Embeddable
public class SttId implements Serializable {

    @Column(name = "user_id", length = 10)
    private String userId;

    @Column(name = "meeting_id")
    private Integer meetingId;

    @Column(name = "question_id")
    private Integer questionId;

    // equals() 및 hashCode() 오버라이드
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SttId)) return false;
        SttId sttId = (SttId) o;
        return Objects.equals(userId, sttId.userId) &&
                Objects.equals(meetingId, sttId.meetingId) &&
                Objects.equals(questionId, sttId.questionId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, meetingId, questionId);
    }
}
