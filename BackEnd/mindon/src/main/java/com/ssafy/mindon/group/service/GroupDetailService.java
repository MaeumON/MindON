package com.ssafy.mindon.group.service;

import com.ssafy.mindon.common.error.ErrorCode;
import com.ssafy.mindon.common.exception.NotFoundException;
import com.ssafy.mindon.common.exception.GroupException;
import com.ssafy.mindon.common.util.JwtUtil;
import com.ssafy.mindon.group.dto.GroupDetailResponse;
import com.ssafy.mindon.group.entity.Group;
import com.ssafy.mindon.group.repository.GroupRepository;
import com.ssafy.mindon.usergroup.repository.UserGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GroupDetailService {

    private final GroupRepository groupRepository;
    private final UserGroupRepository userGroupRepository;
    private final JwtUtil jwtUtil;

    public GroupDetailResponse findGroupDetailById(String accessToken, Integer groupId) {
        // JWT에서 userId 추출
        String userId = jwtUtil.extractUserId(accessToken);

        // 그룹 정보 조회
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.GROUP_NOT_FOUND));

        // 사용자의 그룹 가입 여부 확인
        boolean isRegistered = userGroupRepository.existsByUser_UserIdAndGroup_GroupId(userId, groupId);

        // DTO 변환 후 반환
        GroupDetailResponse dto = new GroupDetailResponse();
        dto.setRegistered(isRegistered);
        dto.setGroupId(group.getGroupId());
        dto.setTitle(group.getTitle());
        dto.setDiseaseId(group.getDisease().getDiseaseId());
        dto.setDiseaseName(group.getDisease().getDiseaseName());
        dto.setDescription(group.getDescription());
        dto.setIsPrivate(group.getIsPrivate());
        dto.setPrivatePassword(group.getPrivatePassword());
        dto.setInviteCode(group.getInviteCode());
        dto.setIsHost(group.getIsHost());
        dto.setStartDate(group.getStartDate());
        dto.setPeriod(group.getPeriod());
        dto.setMeetingTime(group.getMeetingTime());
        dto.setDayOfWeek(group.getDayOfWeek());
        dto.setMinMember(group.getMinMember());
        dto.setMaxMember(group.getMaxMember());
        dto.setTotalMember(group.getTotalMember());
        dto.setGroupStatus(group.getGroupStatus());
        dto.setProgressWeeks(group.getProgressWeeks());

        return dto;
    }
}
