package com.ssafy.mindon.user.service;

import com.ssafy.mindon.common.error.ErrorCode;
import com.ssafy.mindon.common.exception.BusinessBaseException;
import com.ssafy.mindon.group.repository.GroupRepository;
import com.ssafy.mindon.meeting.entity.Meeting;
import com.ssafy.mindon.meeting.repository.MeetingRepository;
import com.ssafy.mindon.user.UserEmotionResponseDto;
import com.ssafy.mindon.usergroup.entity.UserGroup;
import com.ssafy.mindon.usergroup.repository.UserGroupRepository;
import com.ssafy.mindon.userreview.entity.UserReview;
import com.ssafy.mindon.userreview.repository.UserReviewRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserGroupRepository userGroupRepository;
    private final GroupRepository groupRepository;
    private final MeetingRepository meetingRepository;
    private final UserReviewRepository userReviewRepository;

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
        int exitGroup = (int) finishedGroupsCount;
        int avgEmotion = BASE_SCORE + (int) totalEmotionScore + (int) finishedGroupsCount;

        return new UserEmotionResponseDto(avgEmotion, exitGroup);


    }
}
