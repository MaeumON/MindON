package com.ssafy.mindon.usergroup.repository;

import com.ssafy.mindon.usergroup.entity.UserGroup;
import com.ssafy.mindon.usergroup.entity.UserGroupId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserGroupRepository extends JpaRepository<UserGroup, UserGroupId> {
    boolean existsByUser_UserIdAndGroup_MeetingTimeAndGroup_DayOfWeek(String userId, Byte meetingTime, Byte dayOfWeek);

    List<UserGroup> findByUser_UserId(String userId);

    Optional<UserGroup> findByUser_UserIdAndGroup_GroupId(String userId, int groupId); // 사용자와 그룹으로 UserGroup 찾기
}
