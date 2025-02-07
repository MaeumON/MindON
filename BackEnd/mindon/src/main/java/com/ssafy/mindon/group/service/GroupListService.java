package com.ssafy.mindon.group.service;

import com.ssafy.mindon.group.dto.GroupListResponse;
import com.ssafy.mindon.group.entity.Group;
import com.ssafy.mindon.group.repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupListService {

    private final GroupRepository groupRepository;

    public List<GroupListResponse> findGroupsByCriteria(String keyword, List<Byte> diseaseId, Boolean isHost,
                                                        LocalDateTime startDate, Byte period, Byte startTime,
                                                        Byte endTime, List<Byte> dayOfWeek) {

        // Repository에서 결과 조회
        List<Group> groups = groupRepository.findGroupsByCriteria(keyword, diseaseId, isHost, startDate, period, startTime, endTime, dayOfWeek);

        // Group 엔티티를 GroupListResponse DTO로 변환
        return groups.stream().map(group -> {
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
