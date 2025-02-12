package com.ssafy.mindon.group.service;

import com.ssafy.mindon.common.error.ErrorCode;
import com.ssafy.mindon.common.exception.GroupException;
import com.ssafy.mindon.common.exception.NotFoundException;
import com.ssafy.mindon.common.util.JwtUtil;
import com.ssafy.mindon.group.dto.GroupListResponse;
import com.ssafy.mindon.group.entity.Group;
import com.ssafy.mindon.group.repository.GroupRepository;
import com.ssafy.mindon.user.repository.UserRepository;
import com.ssafy.mindon.usergroup.entity.UserGroup;
import com.ssafy.mindon.usergroup.repository.UserGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupListService {

    private final GroupRepository groupRepository;
    private final UserGroupRepository userGroupRepository; // 사용자-그룹 관계를 처리하는 레포지토리
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;  // JwtUtil 객체 주입

    public Page<GroupListResponse> findGroupsByCriteria(String keyword, List<Byte> diseaseId, Boolean isHost,
                                                        LocalDateTime startDate, Byte period, Byte startTime,
                                                        Byte endTime, List<Byte> dayOfWeek, Pageable pageable) {

        // 빈 리스트 처리
        if (diseaseId == null || diseaseId.isEmpty()) {
            diseaseId = null;
        }

        if (dayOfWeek == null || dayOfWeek.isEmpty()) {
            dayOfWeek = null;
        }

        // period 기본값 -> 전체 조회
        if (period == null || period == 0) {
            period = null;
        }

        if (pageable == null) {
            throw new GroupException(ErrorCode.INVALID_INPUT_VALUE);
        }

        // Repository에서 결과 조회
        Page<Group> groups = groupRepository.findGroupsByCriteria(keyword, diseaseId, isHost, startDate, period, startTime, endTime, dayOfWeek, pageable);

        return groups.map(this::mapToDto);
    }

    public List<GroupListResponse> findGroupsByAccessTokenAndStatus(String accessToken, Byte groupStatus, String keyword) {
        String userId = jwtUtil.extractUserId(accessToken);

        if (!userRepository.existsById(userId)) {
            throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
        }

        // 사용자가 가입된 그룹 목록 조회
        List<UserGroup> userGroups = userGroupRepository.findByUser_UserId(userId);

        // 그룹 ID를 이용해 그룹 정보 조회
        List<Integer> groupIds = userGroups.stream()
                .map(userGroup -> userGroup.getGroup().getGroupId()) // groupId를 직접 참조
                .toList();

        if (groupStatus == null || groupStatus < 0 || groupStatus > 2) {
            throw new GroupException(ErrorCode.INVALID_INPUT_VALUE);
        }

        List<Group> filteredGroups = groupRepository.findGroupsByKeywordAndStatus(groupIds, groupStatus, keyword);

        return filteredGroups.stream().map(this::mapToDto).toList();
    }

    private GroupListResponse mapToDto(Group group) {
        GroupListResponse dto = new GroupListResponse();
        dto.setGroupId(group.getGroupId());
        dto.setTitle(group.getTitle());
        dto.setDiseaseId(group.getDisease().getDiseaseId());
        dto.setDiseaseName(group.getDisease().getDiseaseName());
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
        return dto;
    }
}