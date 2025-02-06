package com.ssafy.mindon.group.service;

import com.ssafy.mindon.group.entity.Group;
import com.ssafy.mindon.group.repository.GroupRepository;
import com.ssafy.mindon.user.entity.User;
import com.ssafy.mindon.user.repository.UserRepository;
import com.ssafy.mindon.usergroup.entity.UserGroup;
import com.ssafy.mindon.usergroup.repository.UserGroupRepository;
import com.ssafy.mindon.common.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class GroupJoinService {

    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final UserGroupRepository userGroupRepository;
    private final JwtUtil jwtUtil;

    public GroupJoinService(GroupRepository groupRepository, UserRepository userRepository, UserGroupRepository userGroupRepository, JwtUtil jwtUtil) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.userGroupRepository = userGroupRepository;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public ResponseEntity<?> joinGroup(String accessToken, Integer groupId) {
        String userId = jwtUtil.extractUserId(accessToken);

        // 사용자 조회
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }
        User user = userOpt.get();

        // 그룹 조회
        Optional<Group> groupOpt = groupRepository.findById(groupId);
        if (groupOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Group not found");
        }
        Group group = groupOpt.get();

        // 해당 시간에 다른 모임이 있는지 확인
        boolean hasSameTimeGroup = userGroupRepository.existsByUser_UserIdAndGroup_MeetingTimeAndGroup_DayOfWeek(
                userId, group.getMeetingTime(), group.getDayOfWeek()
        );

        if (hasSameTimeGroup) {
            return ResponseEntity.badRequest().body("{\"message\": \"GroupJoinSameTime\"}");
        }

        // 그룹 정원이 초과되었는지 확인
        if (group.getTotalMember() >= group.getMaxMember()) {
            return ResponseEntity.badRequest().body("{\"message\": \"GroupFull\"}");
        }

        // 그룹 가입 로직
        group.setTotalMember((byte) (group.getTotalMember() + 1));
        groupRepository.save(group);

        // UserGroup 생성 및 저장
        UserGroup userGroup = new UserGroup();
        userGroup.setUser(user);
        userGroup.setGroup(group);
        userGroup.setCreatedDate(java.time.LocalDateTime.now());
        userGroup.setBanned(false);
        userGroup.setBannedDate(null);
        userGroupRepository.save(userGroup);

        return ResponseEntity.ok("{\"message\": \"success\"}");
    }
}
