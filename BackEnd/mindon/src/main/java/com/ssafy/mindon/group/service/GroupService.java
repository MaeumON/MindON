package com.ssafy.mindon.group.service;

import com.ssafy.mindon.common.error.ErrorCode;
import com.ssafy.mindon.group.entity.Group;
import com.ssafy.mindon.group.repository.GroupRepository;
import com.ssafy.mindon.usergroup.repository.UserGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GroupService {

    private final GroupRepository groupRepository;
    private final UserGroupRepository userGroupRepository;

    @Autowired
    public GroupService(GroupRepository groupRepository, UserGroupRepository userGroupRepository) {
        this.groupRepository = groupRepository;
        this.userGroupRepository = userGroupRepository;
    }

    public boolean isHostGroup(String sessionId) {
        try {
            int groupId = Integer.parseInt(sessionId);
            // 그룹 조회
            Group group = groupRepository.findById(groupId)
                    .orElseThrow(() -> new ResponseStatusException(ErrorCode.NOT_FOUND.getStatus(),
                            ErrorCode.NOT_FOUND.getMessage() + ": " + groupId));

            return group.getIsHost();
        } catch (NumberFormatException e) {
            throw new ResponseStatusException(ErrorCode.INVALID_INPUT_VALUE.getStatus(),
                    ErrorCode.INVALID_INPUT_VALUE.getMessage() + ": " + sessionId, e);
        }
    }

    @Transactional(readOnly = true)
    public Map<String,Integer> getUserGroupStatusCount(String userId){
        List<Integer> groupIds = userGroupRepository.findByUser_UserId(userId)
                .stream()
                .map(userGroup -> userGroup.getGroup().getGroupId())
                .toList();

        if (groupIds.isEmpty()) {
            return Map.of("preGroup", 0, "startingGroup", 0, "endGroup", 0);
        }

        List<Group> groups = groupRepository.findAllByGroupIdIn(groupIds);

        Map<Byte, Long> statusCountMap = groups.stream()
                .collect(Collectors.groupingBy(Group::getGroupStatus, Collectors.counting()));

        return Map.of(
                "preGroup", statusCountMap.getOrDefault((byte) 0, 0L).intValue(),
                "startingGroup", statusCountMap.getOrDefault((byte) 1, 0L).intValue(),
                "endGroup", statusCountMap.getOrDefault((byte) 2, 0L).intValue()
        );
    }
}
