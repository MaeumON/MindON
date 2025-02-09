package com.ssafy.mindon.group.service;

import com.ssafy.mindon.common.util.JwtUtil;
import com.ssafy.mindon.group.dto.GroupListResponse;
import com.ssafy.mindon.group.entity.Group;
import com.ssafy.mindon.usergroup.entity.UserGroup;  // 사용자가 가입한 그룹을 나타내는 엔티티
import com.ssafy.mindon.group.repository.GroupRepository;
import com.ssafy.mindon.usergroup.repository.UserGroupRepository;  // 사용자가 가입한 그룹을 조회하는 레포지토리
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupMyListService {

    private final GroupRepository groupRepository;
    private final UserGroupRepository userGroupRepository; // 사용자-그룹 관계를 처리하는 레포지토리
    private final JwtUtil jwtUtil;  // JwtUtil 객체 주입

    public List<GroupListResponse> findGroupsByAccessTokenAndStatus(String accessToken, Byte groupStatus) {
        String userId = jwtUtil.extractUserId(accessToken);

        // 사용자가 가입된 그룹 목록 조회
        List<UserGroup> userGroups = userGroupRepository.findByUser_UserId(userId);

        // 그룹 ID를 이용해 그룹 정보 조회
        List<Integer> groupIds = userGroups.stream()
                .map(userGroup -> userGroup.getGroup().getGroupId()) // groupId를 직접 참조
                .toList();

        List<Group> groups = groupRepository.findAllById(groupIds);

        // 그룹 상태에 따라 필터링 - 입력받은 그룹 현황에 따라 필터링
        List<Group> filteredGroups = groups.stream()
                .filter(group -> group.getGroupStatus().equals(groupStatus))
                .toList();

        // Group 엔티티를 GroupListResponse DTO로 변환
        return filteredGroups.stream().map(group -> {
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
            dto.setMinMembers(group.getMinMember());
            dto.setMaxMembers(group.getMaxMember());
            dto.setTotalMembers(group.getTotalMember());
            dto.setGroupStatus(group.getGroupStatus());
            return dto;
        }).toList();
    }
}
