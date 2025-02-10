package com.ssafy.mindon.user.entity;

import com.ssafy.mindon.disease.entity.Disease;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {
    // 회원 정보를 나타내는 JPA 엔티티

    @Id
    @Column(name = "user_id", length = 10, nullable = false)
    private String userId; // VARCHAR(10)

    @Column(name = "user_name", length = 5, nullable = false)
    private String userName; // VARCHAR(5)

    @Column(name = "password", length = 255, nullable = false)
    private String password; // VARCHAR(255)

    @Column(name = "phone", length = 20, nullable = false)
    private String phone; // VARCHAR(20)

    @Column(name = "disease_id", nullable = false)
    private Byte diseaseId; // TINYINT

    @CreationTimestamp
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate; // DATETIME

    @Column(name = "updated_date", insertable = false)
    private LocalDateTime updatedDate; // DATETIME

    @Column(name = "user_status", nullable = false, columnDefinition = "TINYINT DEFAULT 0")
    private Byte userStatus; // TINYINT (0: 활성화, 1: 탈퇴, 2: 정지)

    @Column(name = "reported_cnt", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer reportedCnt; // INT

    @PrePersist
    @PreUpdate
    public void setDefaultValues() {
        if (this.reportedCnt == null) {
            this.reportedCnt = 0; // 기본값 0으로 설정
        }
        if (this.userStatus == null) {
            this.userStatus = 0; // 기본값을 '활성화'로 설정
        }
    }

    @ManyToOne
    @JoinColumn(name = "disease_id", referencedColumnName = "disease_id", insertable = false, updatable = false)
    private Disease disease; // 외래 키 관계 설정
}
