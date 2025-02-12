package com.ssafy.mindon.group.service;

import com.ssafy.mindon.common.error.ErrorCode;
import com.ssafy.mindon.common.exception.GroupException;
import com.ssafy.mindon.common.exception.NotFoundException;
import com.ssafy.mindon.common.util.JwtUtil;
import com.ssafy.mindon.group.entity.Group;
import com.ssafy.mindon.user.entity.User;
import com.ssafy.mindon.user.repository.UserRepository;
import com.ssafy.mindon.usergroup.entity.UserGroup;
import com.ssafy.mindon.group.repository.GroupRepository;
import com.ssafy.mindon.usergroup.repository.UserGroupRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;
@Service
public class GroupLeaveService {

    private final GroupRepository groupRepository;
    private final UserGroupRepository userGroupRepository;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Autowired
    public GroupLeaveService(GroupRepository groupRepository, UserGroupRepository userGroupRepository,
                             JwtUtil jwtUtil, UserRepository userRepository) {
        this.groupRepository = groupRepository;
        this.userGroupRepository = userGroupRepository;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Transactional
    public void leaveGroup(int groupId, String accessToken) {
        // 1. 인증된 사용자 정보 추출
        String userId = jwtUtil.extractUserId(accessToken);

        // 2. 사용자 정보 가져오기
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND));

        // 3. 그룹 정보 가져오기
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new GroupException(ErrorCode.GROUP_NOT_FOUND));

        // 4. 사용자가 그룹에 속해 있는지 확인
        UserGroup userGroup = userGroupRepository.findByUser_UserIdAndGroup_GroupId(user.getUserId(), groupId)
                .orElseThrow(() -> new GroupException(ErrorCode.USER_NOT_IN_GROUP));

        // 5. 사용자 그룹 탈퇴 처리
        userGroupRepository.delete(userGroup);

        // 6. 그룹 total_member 감소
        if (group.getTotalMember() > 0) {
            group.setTotalMember((byte) (group.getTotalMember() - 1));
            groupRepository.save(group);
        }

        // 7. 그룹 인원이 0명이면 그룹 삭제 -> meetings는 자동삭제
        if (group.getTotalMember() == 0) {
            groupRepository.delete(group);
        }
    }
}