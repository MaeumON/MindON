package com.ssafy.mindon.group.service;

import com.ssafy.mindon.common.error.ErrorCode;
import com.ssafy.mindon.common.exception.AuthException;
import com.ssafy.mindon.common.exception.GroupException;
import com.ssafy.mindon.common.exception.NotFoundException;
import com.ssafy.mindon.group.entity.Group;
import com.ssafy.mindon.group.repository.GroupRepository;
import com.ssafy.mindon.meeting.repository.MeetingRepository;
import com.ssafy.mindon.user.entity.User;
import com.ssafy.mindon.user.repository.UserRepository;
import com.ssafy.mindon.usergroup.entity.UserGroup;
import com.ssafy.mindon.usergroup.repository.UserGroupRepository;
import com.ssafy.mindon.common.util.JwtUtil;
import jdk.jshell.spi.ExecutionControl;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroupJoinService {

    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final UserGroupRepository userGroupRepository;
    private final MeetingRepository meetingRepository;
    private final JwtUtil jwtUtil;

    public GroupJoinService(GroupRepository groupRepository, UserRepository userRepository, UserGroupRepository userGroupRepository, MeetingRepository meetingRepository, JwtUtil jwtUtil) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.userGroupRepository = userGroupRepository;
        this.meetingRepository = meetingRepository;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public void joinGroup(String accessToken, Integer groupId) {
        String userId = jwtUtil.extractUserId(accessToken);

        // 사용자와 그룹 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new GroupException(ErrorCode.GROUP_NOT_FOUND));

        // 같은 시간대 그룹 가입 여부 체크
        if (isGroupAtSameTime(userId, group)) {
            throw new GroupException(ErrorCode.GROUP_JOIN_SAME_TIME);
        }

        // 그룹 정원 초과 여부 체크
        if (isGroupFull(group)) {
            throw new GroupException(ErrorCode.GROUP_FULL);
        }

        // 그룹 가입 로직
        addUserToGroup(user, group);
    }

    private boolean isGroupAtSameTime(String userId, Group group) {
        // 사용자가 가입한 모든 그룹 ID 조회
        List<Integer> joinedGroupIds = userGroupRepository.findByUser_UserId(userId)
                .stream()
                .map(userGroup -> userGroup.getGroup().getGroupId())
                .collect(Collectors.toList());

        if (joinedGroupIds.isEmpty()) {
            return false;
        }

        // 사용자가 가입한 그룹들의 미팅 중 새로 가입하려는 그룹의 startDate와 같은 날짜 및 시간의 미팅이 있는지 확인
        return meetingRepository.findAllByGroup_GroupIdIn(joinedGroupIds)
                .stream()
                .anyMatch(meeting ->
                        meeting.getDate().equals(group.getStartDate()));
    }

    private boolean isGroupFull(Group group) {
        return group.getTotalMember() >= group.getMaxMember();
    }

    private void addUserToGroup(User user, Group group) {
        // 그룹 총원 증가
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
    }
}
