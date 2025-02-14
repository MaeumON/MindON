package com.ssafy.mindon.group.service;

import com.ssafy.mindon.common.error.ErrorCode;
import com.ssafy.mindon.common.exception.GroupException;
import com.ssafy.mindon.common.exception.NotFoundException;
import com.ssafy.mindon.common.util.JwtUtil;
import com.ssafy.mindon.disease.entity.Disease;
import com.ssafy.mindon.disease.repository.DiseaseRepository;
import com.ssafy.mindon.group.dto.CreateGroupRequestDto;
import com.ssafy.mindon.group.dto.GroupDetailResponseDto;
import com.ssafy.mindon.group.dto.GroupListResponseDto;
import com.ssafy.mindon.group.entity.Group;
import com.ssafy.mindon.group.repository.GroupRepository;
import com.ssafy.mindon.meeting.entity.Meeting;
import com.ssafy.mindon.meeting.repository.MeetingRepository;
import com.ssafy.mindon.user.entity.User;
import com.ssafy.mindon.user.repository.UserRepository;
import com.ssafy.mindon.usergroup.entity.UserGroup;
import com.ssafy.mindon.usergroup.repository.UserGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.ssafy.mindon.common.error.ErrorCode.GROUP_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final UserGroupRepository userGroupRepository;
    private final DiseaseRepository diseaseRepository;
    private final MeetingRepository meetingRepository;
    private final JwtUtil jwtUtil;

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

    public GroupDetailResponseDto findGroupDetailById(String accessToken, Integer groupId) {
        // JWT에서 userId 추출
        String userId = jwtUtil.extractUserId(accessToken);

        // 그룹 정보 조회
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.GROUP_NOT_FOUND));

        // 사용자의 그룹 가입 여부 확인
        boolean isRegistered = userGroupRepository.existsByUser_UserIdAndGroup_GroupId(userId, groupId);

        // DTO 변환 후 반환
        GroupDetailResponseDto dto = new GroupDetailResponseDto();
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

    @Transactional
    public void joinGroup(String accessToken, Integer groupId) {
        String userId = jwtUtil.extractUserId(accessToken);

        // 사용자와 그룹 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new GroupException(ErrorCode.GROUP_NOT_FOUND));

        // 같은 시간대 그룹 가입 여부 체크
        if (isGroupAtSameTime(userId, group)) {
            throw new GroupException(ErrorCode.GROUP_JOIN_SAME_TIME);
        }

        // 그룹 정원 초과 여부 체크
        if (isGroupFull(group)) {
            throw new GroupException(ErrorCode.GROUP_FULL);
        }

        // 그룹 가입 로직
        addUserToGroup(user, group);
    }

    private boolean isGroupAtSameTime(String userId, Group group) {
        // 사용자가 가입한 모든 그룹 ID 조회
        List<Integer> joinedGroupIds = userGroupRepository.findByUser_UserId(userId)
                .stream()
                .map(userGroup -> userGroup.getGroup().getGroupId())
                .collect(Collectors.toList());

        if (joinedGroupIds.isEmpty()) {
            return false;
        }

        // 사용자가 가입한 그룹들의 미팅 중 새로 가입하려는 그룹의 startDate와 같은 날짜 및 시간의 미팅이 있는지 확인
        return meetingRepository.findAllByGroup_GroupIdIn(joinedGroupIds)
                .stream()
                .anyMatch(meeting ->
                        meeting.getDate().equals(group.getStartDate()));
    }

    private boolean isGroupFull(Group group) {
        return group.getTotalMember() >= group.getMaxMember();
    }

    private void addUserToGroup(User user, Group group) {
        // 그룹 총원 증가
        group.setTotalMember((byte) (group.getTotalMember() + 1));
        groupRepository.save(group);

        // UserGroup 생성 및 저장
        UserGroup userGroup = new UserGroup();
        userGroup.setUser(user);
        userGroup.setGroup(group);
        userGroup.setCreatedDate(java.time.LocalDateTime.now());
        userGroup.setBanned(false);
        userGroup.setBannedDate(null);
        userGroupRepository.save(userGroup);
    }

    @jakarta.transaction.Transactional
    public void leaveGroup(int groupId, String accessToken) {
        // 1. 인증된 사용자 정보 추출
        String userId = jwtUtil.extractUserId(accessToken);

        // 2. 사용자 정보 가져오기
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND));

        // 3. 그룹 정보 가져오기
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new GroupException(ErrorCode.GROUP_NOT_FOUND));

        // 4. 사용자가 그룹에 속해 있는지 확인
        UserGroup userGroup = userGroupRepository.findByUser_UserIdAndGroup_GroupId(user.getUserId(), groupId)
                .orElseThrow(() -> new GroupException(ErrorCode.USER_NOT_IN_GROUP));

        // 5. 사용자 그룹 탈퇴 처리
        userGroupRepository.delete(userGroup);

        // 6. 그룹 total_member 감소
        if (group.getTotalMember() > 0) {
            group.setTotalMember((byte) (group.getTotalMember() - 1));
            groupRepository.save(group);
        }

        // 7. 그룹 인원이 0명이면 그룹 삭제 -> meetings는 자동삭제
        if (group.getTotalMember() == 0) {
            groupRepository.delete(group);
        }
    }

    public Page<GroupListResponseDto> findGroupsByCriteria(String keyword, List<Byte> diseaseId, Boolean isHost,
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

    public List<GroupListResponseDto> findGroupsByAccessTokenAndStatus(String accessToken, Byte groupStatus, String keyword) {
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

    private GroupListResponseDto mapToDto(Group group) {
        GroupListResponseDto dto = new GroupListResponseDto();
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

    public List<GroupListResponseDto> getRecommendedGroups(Byte diseaseId) {
        // 관심 질병 기반 최신 그룹 5개 조회
        List<Group> groups = groupRepository.findTop5ByDiseaseDiseaseIdAndGroupStatusOrderByCreatedDateDesc(diseaseId, (byte) 0);

        // Entity -> DTO 변환
        return groups.stream().map(group -> {
            GroupListResponseDto response = new GroupListResponseDto();
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

    public boolean isHostGroup(String sessionId) {
        try {
            int groupId = Integer.parseInt(sessionId);
            // 그룹 조회
            Group group = groupRepository.findById(groupId)
                    .orElseThrow(() -> new NotFoundException(ErrorCode.GROUP_NOT_FOUND));

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
    @Transactional
    public int updateGroupStatusToOngoing() {
        LocalDateTime now = LocalDateTime.now();
        return groupRepository.updateGroupStatusToOngoing(now);
    }

    @Transactional
    public int updateGroupStatusToEnded() {
        LocalDateTime now = LocalDateTime.now();
        return groupRepository.updateGroupStatusToEnded(now);
    }

    @Transactional
    public int updateProgressWeeks() {
        return groupRepository.updateProgressWeeks();
    }

    public boolean checkGroupPassword(Integer groupId, String privatePassword) {
        System.out.println(groupId + "ser" + privatePassword);
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new GroupException(ErrorCode.GROUP_NOT_FOUND));

        // 비밀번호 일치 여부 반환
        return privatePassword.equals(group.getPrivatePassword());
    }

    // 초대 코드 랜덤 생성 메서드
    private String generateInviteCode() {
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

}
