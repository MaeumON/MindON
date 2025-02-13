package com.ssafy.mindon.group.service;

import com.ssafy.mindon.disease.entity.Disease;
import com.ssafy.mindon.disease.repository.DiseaseRepository;
import com.ssafy.mindon.group.entity.Group;
import com.ssafy.mindon.group.repository.GroupRepository;
import com.ssafy.mindon.meeting.entity.Meeting;
import com.ssafy.mindon.meeting.repository.MeetingRepository;
import com.ssafy.mindon.user.entity.User;
import com.ssafy.mindon.user.repository.UserRepository;
import com.ssafy.mindon.usergroup.entity.UserGroup;
import com.ssafy.mindon.usergroup.repository.UserGroupRepository;
import com.ssafy.mindon.group.dto.CreateGroupRequestDto;
import com.ssafy.mindon.common.util.JwtUtil;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class GroupCreateService {

    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final UserGroupRepository userGroupRepository;
    private final DiseaseRepository diseaseRepository;
    private final MeetingRepository meetingRepository;
    private final JwtUtil jwtUtil;

    public GroupCreateService(GroupRepository groupRepository, UserRepository userRepository,
                              UserGroupRepository userGroupRepository, DiseaseRepository diseaseRepository, MeetingRepository meetingRepository,
                              JwtUtil jwtUtil) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.userGroupRepository = userGroupRepository;
        this.diseaseRepository = diseaseRepository;
        this.meetingRepository = meetingRepository;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public boolean createGroup(String accessToken, CreateGroupRequestDto request) {
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


        // 사용자가 가입된 그룹 ID 조회
        List<Integer> joinedGroupIds = userGroupRepository.findByUser_UserId(user.getUserId())
                .stream().map(userGroup -> userGroup.getGroup().getGroupId()).collect(Collectors.toList());

        // 해당 그룹들의 미팅 일정 조회
        List<Meeting> userMeetings = meetingRepository.findAllByGroup_GroupIdIn(joinedGroupIds);

        // 새로운 그룹의 미팅 일정과 충돌 여부 확인
        boolean hasConflict = userMeetings.stream().anyMatch(meeting ->
                meeting.getDate().equals(request.getStartDate())
        );

        if (hasConflict) {
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
        group.setMinMember(request.getMinMember().byteValue());
        group.setMaxMember(request.getMaxMember().byteValue());
        group.setStartDate(request.getStartDate());
        group.setCreatedUser(user);
        group.setDisease(disease);

        // 초대 코드 중복 검사 및 생성 로직
        String inviteCode;
        do {
            inviteCode = generateInviteCode();
        } while (groupRepository.existsByInviteCode(inviteCode));
        group.setInviteCode(inviteCode);

        groupRepository.save(group);

        // UserGroup 생성 및 저장
        UserGroup userGroup = new UserGroup();
        userGroup.setUser(user);
        userGroup.setGroup(group);
        userGroup.setCreatedDate(LocalDateTime.now());
        userGroup.setBanned(false);
        userGroup.setBannedDate(null);

        userGroupRepository.save(userGroup);

        // Meetings 생성 및 저장
        for (byte week = 1; week <= group.getPeriod(); week++) {
            Meeting meeting = new Meeting();
            meeting.setMeetingWeek(week);
            meeting.setGroup(group);
            meeting.setDate(group.getStartDate().plusWeeks(week - 1)); // 주차별 날짜 계산
            meeting.setMeetingStatus((byte) 0); // 0: 진행 전

            // 주차별 커리큘럼 설정
            if (week == 1) {
                meeting.setCurriculum((byte) 1); // 첫 주차
            } else if (week == group.getPeriod()) {
                meeting.setCurriculum((byte) 3); // 마지막 주차
            } else {
                meeting.setCurriculum((byte) 2); // 중간 주차
            }

            meetingRepository.save(meeting);
        }


        return true;
    }

    // 초대 코드 랜덤 생성 메서드
    private String generateInviteCode() {
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
