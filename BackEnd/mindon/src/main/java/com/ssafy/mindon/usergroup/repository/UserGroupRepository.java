package com.ssafy.mindon.usergroup.repository;

import com.ssafy.mindon.usergroup.entity.UserGroup;
import com.ssafy.mindon.usergroup.entity.UserGroupId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserGroupRepository extends JpaRepository<UserGroup, UserGroupId> {
    boolean existsByUser_UserIdAndGroup_MeetingTimeAndGroup_DayOfWeek(String userId, Byte meetingTime, Byte dayOfWeek);

    List<UserGroup> findByUser_UserId(String userId);
}
