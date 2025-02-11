package com.ssafy.mindon.group.entity;

import com.ssafy.mindon.disease.entity.Disease;
import com.ssafy.mindon.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;


import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "`groups`")
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "group_id", nullable = false)
    private Integer groupId; // INT AUTO_INCREMENT

    @Column(name = "title", length = 15, nullable = false)
    private String title; // VARCHAR(15)

    @Column(name = "description", columnDefinition = "TEXT")
    private String description; // TEXT

    @Column(name = "is_private", nullable = false)
    private Boolean isPrivate; // BOOLEAN (공개/비공개 여부)

    @Column(name = "private_password", length = 4)
    private String privatePassword; // VARCHAR(4) (비공개 그룹 비밀번호)

    @Column(name = "is_host", nullable = false)
    private Boolean isHost; // BOOLEAN (방장 여부)

    @Column(name = "period", nullable = false)
    private Byte period; // TINYINT (1~8)

    @Column(name = "invite_code", length = 8, nullable = false)
    private String inviteCode; // VARCHAR(8) (초대 코드)

    @Column(name = "progress_weeks", nullable = false, columnDefinition = "TINYINT DEFAULT 0")
    private Byte progressWeeks; // 진행된 주차

    @Column(name = "total_member", nullable = false, columnDefinition = "TINYINT DEFAULT 0")
    private Byte totalMember; // 현재 참가자 수

    @Column(name = "meeting_time", nullable = false)
    private Byte meetingTime; // 미팅 시간 (0~23)

    @Column(name = "day_of_week", nullable = false)
    private Byte dayOfWeek; // 미팅 요일 (0~6)

    @Column(name = "min_member", nullable = false, columnDefinition = "TINYINT DEFAULT 2")
    private Byte minMember; // 최소 참가 인원

    @Column(name = "max_member", nullable = false, columnDefinition = "TINYINT DEFAULT 8")
    private Byte maxMember; // 최대 참가 인원

    @CreationTimestamp
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate; // 생성 날짜

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate; // 시작 날짜

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate; // 종료 날짜

    @Column(name = "group_status", nullable = false, columnDefinition = "TINYINT DEFAULT 0")
    private Byte groupStatus; // 그룹 상태 (0: 진행예정, 1: 진행중, 2: 종료)

    @ManyToOne
    @JoinColumn(name = "created_user_id", referencedColumnName = "user_id", nullable = false)
    private User createdUser; // 그룹을 생성한 유저 (외래 키)

    @ManyToOne
    @JoinColumn(name = "disease_id", referencedColumnName = "disease_id", nullable = false)
    private Disease disease; // 관련 질병 (외래 키)

    @PrePersist
    @PreUpdate
    public void setDefaultValues() {
        if (this.progressWeeks == null) {
            this.progressWeeks = 0;
        }
        if (this.totalMember == null) {
            this.totalMember = 1; // 인원 추가 로직은 user_group 생성될 때 +1
        }
        if (this.groupStatus == null) {
            this.groupStatus = 0;
        }
        if (this.startDate != null && this.period != null && this.endDate == null) {
            this.endDate = this.startDate.plusWeeks(this.period - 1);
        }
    }

}
