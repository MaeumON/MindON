package com.ssafy.mindon.group.service;

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
    public boolean leaveGroup(int groupId, String accessToken) {
        // 1. 인증된 사용자 정보를 추출 (토큰을 이용한 인증)
        String userId = jwtUtil.extractUserId(accessToken);

        // 2. 사용자 정보 가져오기
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return false; // 사용자가 존재하지 않으면 실패
        }
        User user = userOptional.get();

        // 3. 그룹에서 해당 사용자 탈퇴 처리
        Optional<UserGroup> userGroupOptional = userGroupRepository.findByUser_UserIdAndGroup_GroupId(user.getUserId(), groupId);
        if (userGroupOptional.isPresent()) {
            UserGroup userGroup = userGroupOptional.get();
            userGroupRepository.delete(userGroup); // 탈퇴 처리

            // 4. 그룹의 total_member를 감소
            Optional<Group> groupOptional = groupRepository.findById(groupId);
            if (groupOptional.isPresent()) {
                Group group = groupOptional.get();
                byte totalMember = group.getTotalMember();
                if (totalMember > 0) {
                    group.setTotalMember((byte) (totalMember - 1));
                }
                groupRepository.save(group); // 그룹 업데이트

                // 5. 만약 total_member가 0이면 meetings와 user_groups에서 해당 group_id 삭제, groups에서도 삭제
                // - 제약조건으로 group삭제 시 연관된 테이블 자동 삭제됨
                if (group.getTotalMember() == 0) {
                    groupRepository.deleteByGroupId(groupId);
                }
                return true; // 탈퇴 완료
            }
        }
        return false; // 그룹에 해당 사용자가 없거나 처리 실패
    }
}
