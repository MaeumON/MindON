package com.ssafy.mindon.stt.entity;

import com.ssafy.mindon.meeting.entity.Meeting;
import com.ssafy.mindon.question.entity.Question;
import com.ssafy.mindon.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "stt")
public class Stt {

    @EmbeddedId
    private SttId id;  // 복합 키 사용

    @ManyToOne
    @MapsId("userId")  // 복합 키와 매핑
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private User user;

    @ManyToOne
    @MapsId("meetingId") // 복합 키와 매핑
    @JoinColumn(name = "meeting_id", referencedColumnName = "meeting_id")
    private Meeting meeting;

    @ManyToOne
    @MapsId("questionId") // 복합 키와 매핑
    @JoinColumn(name = "question_id", referencedColumnName = "question_id")
    private Question question;

    @Column(name = "text", nullable = false)
    private String text;
}
