package com.ssafy.mindon.usergroup.entity;

import com.ssafy.mindon.group.entity.Group;
import com.ssafy.mindon.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "user_group")
@IdClass(UserGroupId.class)  // 복합 키 클래스 적용
public class UserGroup {

    @Id
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Id
    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate = LocalDateTime.now();

    @Column(name = "is_banned", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean isBanned = false;

    @Column(name = "banned_date")
    private LocalDateTime bannedDate;
}
