package com.ssafy.mindon.group.service;

import com.ssafy.mindon.common.error.ErrorCode;
import com.ssafy.mindon.group.entity.Group;
import com.ssafy.mindon.group.repository.GroupRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.server.ResponseStatusException;

@Service
public class GroupService {

    private final GroupRepository groupRepository;

    @Autowired
    public GroupService(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
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
}
