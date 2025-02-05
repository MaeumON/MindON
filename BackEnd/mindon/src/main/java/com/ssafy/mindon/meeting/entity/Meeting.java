package com.ssafy.mindon.meeting.entity;

import com.ssafy.mindon.group.entity.Group;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "meetings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Meeting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "meeting_id")
    private Integer meetingId;

    @Column(name = "meeting_week", nullable = false)
    private Byte meetingWeek;  // TINYINT 매핑

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    @Column(name = "date", nullable = false)
    private LocalDateTime date;

    @Column(name = "meeting_status", nullable = false)
    private Byte meetingStatus; // 0: 진행 전, 1: 진행 중, 2: 종료

    @Column(name = "curriculum")
    private Byte curriculum;

}
