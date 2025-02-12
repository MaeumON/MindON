package com.ssafy.mindon.user.service;

import com.ssafy.mindon.common.error.ErrorCode;
import com.ssafy.mindon.common.exception.AuthException;
import com.ssafy.mindon.common.exception.BusinessBaseException;
import com.ssafy.mindon.common.exception.NotFoundException;
import com.ssafy.mindon.group.repository.GroupRepository;
import com.ssafy.mindon.meeting.entity.Meeting;
import com.ssafy.mindon.meeting.repository.MeetingRepository;
import com.ssafy.mindon.user.dto.SpeakerDto;
import com.ssafy.mindon.user.dto.SpeakerListDto;
import com.ssafy.mindon.user.dto.UserEmotionResponseDto;
import com.ssafy.mindon.user.dto.UserProfileResponseDto;
import com.ssafy.mindon.user.entity.User;
import com.ssafy.mindon.user.repository.UserRepository;
import com.ssafy.mindon.usergroup.entity.UserGroup;
import com.ssafy.mindon.usergroup.repository.UserGroupRepository;
import com.ssafy.mindon.userreview.entity.UserReview;
import com.ssafy.mindon.userreview.repository.UserReviewRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserGroupRepository userGroupRepository;
    private final GroupRepository groupRepository;
    private final MeetingRepository meetingRepository;
    private final UserReviewRepository userReviewRepository;
    private final UserRepository userRepository;

    private static final int BASE_SCORE = 40;  // 기본 점수
    private static final int POSITIVE_INCREMENT = 2; // 긍정 감정 가중치
    private static final int NEGATIVE_DECREMENT = -2; // 부정 감정 가중치

    @Transactional(readOnly = true)
    public UserEmotionResponseDto  calculateUserEmotionScore(String userId){
        List<UserGroup> userGroups = userGroupRepository.findByUser_UserId(userId);
        if(userGroups.isEmpty()){
            throw new BusinessBaseException(ErrorCode.USER_NOT_FOUND);
        }

        List<Integer> groupIds = new ArrayList<>();
        for(UserGroup userGroup : userGroups) {
            groupIds.add(userGroup.getGroup().getGroupId());
        }

        long finishedGroupsCount = groupRepository.countByGroupIdInAndGroupStatus(groupIds, (byte) 2);

        List<Meeting> meetings = meetingRepository.findByGroup_GroupIdIn(groupIds);
        List<Integer> meetingIds = new ArrayList<>();
        for (Meeting meeting : meetings) {
            meetingIds.add(meeting.getMeetingId());
        }

        List<UserReview> userReviews = userReviewRepository.findByUserIdAndMeetingIdIn(userId, meetingIds);

        Map<Integer, List<Integer>> groupEmotionScores = new HashMap<>();
        for (UserReview review : userReviews) {
            int meetingId = review.getMeetingId();

            Optional<Meeting> meetingOptional = meetingRepository.findById(meetingId);
            if (meetingOptional.isPresent()) {
                Meeting meeting = meetingOptional.get();
                int groupId = meeting.getGroup().getGroupId();

                int emotionId = review.getEmotionId();
                int score = 0;
                if (emotionId >= 1 && emotionId <= 4) {
                    score = POSITIVE_INCREMENT;
                } else if (emotionId >= 5 && emotionId <= 8) {
                    score = NEGATIVE_DECREMENT;
                }

                groupEmotionScores.computeIfAbsent(groupId, k -> new ArrayList<>()).add(score);

            }
        }
        double totalEmotionScore = groupEmotionScores.values().stream()
                .mapToDouble(groupScores -> groupScores.stream().mapToInt(Integer::intValue).average().orElse(0))
                .sum();

        int temperature = BASE_SCORE + (int) totalEmotionScore + (int) finishedGroupsCount;

        return new UserEmotionResponseDto(temperature);


    }

    @Transactional
    public void deleteUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND));

        user.setUserStatus((byte) 1);
    }

    public SpeakerListDto getSpeakerList(Set<String> userIds) {
        List<SpeakerDto> speakerDtos = new ArrayList<>();
        int no = 1;

        for (String userId : userIds) {
            User user = userRepository.findByUserId(userId);

            if (user != null) {
                speakerDtos.add(new SpeakerDto(no++, user.getUserId(), user.getUserName()));
            }
        }

        return new SpeakerListDto(speakerDtos);
    }

    public UserProfileResponseDto getUserProfile(String userId) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new NotFoundException(ErrorCode.USER_NOT_FOUND); // 사용자가 존재하지 않으면 예외 발생
        }

        return new UserProfileResponseDto(
                user.getUserId(),
                user.getUserName(),
                user.getPhone(),
                user.getDisease() != null ? user.getDisease().getDiseaseId() : null,
                user.getDisease() != null ? user.getDisease().getDiseaseName() : null
        );
    }
}
