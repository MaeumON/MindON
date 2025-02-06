package com.ssafy.mindon.group.service;

import com.ssafy.mindon.disease.entity.Disease;
import com.ssafy.mindon.disease.repository.DiseaseRepository;
import com.ssafy.mindon.group.entity.Group;
import com.ssafy.mindon.group.repository.GroupRepository;
import com.ssafy.mindon.user.entity.User;
import com.ssafy.mindon.user.repository.UserRepository;
import com.ssafy.mindon.usergroup.repository.UserGroupRepository;
import com.ssafy.mindon.group.dto.CreateGroupRequest;
import com.ssafy.mindon.common.util.JwtUtil;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class GroupCreateService {

    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final UserGroupRepository userGroupRepository;
    private final DiseaseRepository diseaseRepository;
    private final JwtUtil jwtUtil;

    public GroupCreateService(GroupRepository groupRepository, UserRepository userRepository,
                              UserGroupRepository userGroupRepository, DiseaseRepository diseaseRepository,
                              JwtUtil jwtUtil) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.userGroupRepository = userGroupRepository;
        this.diseaseRepository = diseaseRepository;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public boolean createGroup(String accessToken, CreateGroupRequest request) {
        String userId = jwtUtil.extractUserId(accessToken);
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return false;
        }

        Optional<Disease> diseaseOpt = diseaseRepository.findById(request.getDiseaseId().byteValue());
        if (diseaseOpt.isEmpty()) {
            return false;
        }

        User user = userOpt.get();
        Disease disease = diseaseOpt.get();

        boolean hasConflictingGroup = userGroupRepository.existsByUser_UserIdAndGroup_MeetingTimeAndGroup_DayOfWeek(
                user.getUserId(), request.getMeetingTime().byteValue(), request.getDayOfWeek().byteValue()
        );

        if (hasConflictingGroup) {
            return false;
        }

        Group group = new Group();
        group.setTitle(request.getTitle());
        group.setDescription(request.getDescription());
        group.setIsPrivate(request.getIsPrivate());
        group.setPrivatePassword(request.getPrivatePassword());
        group.setIsHost(true);
        group.setPeriod(request.getPeriod().byteValue());
        group.setMeetingTime(request.getMeetingTime().byteValue());
        group.setDayOfWeek(request.getDayOfWeek().byteValue());
        group.setMinMember(request.getMinMembers().byteValue());
        group.setMaxMember(request.getMaxMembers().byteValue());
        group.setStartDate(request.getStartDate());
        group.setCreatedUser(user);
        group.setDisease(disease);

        groupRepository.save(group);

        return true;
    }
}
