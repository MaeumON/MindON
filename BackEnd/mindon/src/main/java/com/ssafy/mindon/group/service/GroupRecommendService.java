package com.ssafy.mindon.group.service;

import com.ssafy.mindon.group.dto.GroupListResponse;
import com.ssafy.mindon.group.entity.Group;
import com.ssafy.mindon.group.repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupRecommendService {

    private final GroupRepository groupRepository;

    public List<GroupListResponse> getRecommendedGroups(Byte diseaseId) {
        // 관심 질병 기반 최신 그룹 5개 조회
//        List<Group> groups = groupRepository.findTop5ByDiseaseDiseaseIdAndGroupStatusOrderByCreatedDateDesc(diseaseId);

        List<Group> groups = groupRepository.findTop5ByDiseaseDiseaseIdAndGroupStatusOrderByCreatedDateDesc(diseaseId, (byte) 0);

        // Entity -> DTO 변환
        return groups.stream().map(group -> {
            GroupListResponse response = new GroupListResponse();
            response.setGroupId(group.getGroupId());
            response.setTitle(group.getTitle());
            response.setDiseaseId(group.getDisease().getDiseaseId());
            response.setDiseaseName(group.getDisease().getDiseaseName());
            response.setIsPrivate(group.getIsPrivate());
            response.setPrivatePassword(group.getPrivatePassword());
            response.setInviteCode(group.getInviteCode());
            response.setIsHost(group.getIsHost());
            response.setStartDate(group.getStartDate());
            response.setPeriod(group.getPeriod());
            response.setMeetingTime(group.getMeetingTime());
            response.setDayOfWeek(group.getDayOfWeek());
            response.setMinMember(group.getMinMember());
            response.setMaxMember(group.getMaxMember());
            response.setTotalMember(group.getTotalMember());
            response.setGroupStatus(group.getGroupStatus());
            return response;
        }).toList();
    }
}
