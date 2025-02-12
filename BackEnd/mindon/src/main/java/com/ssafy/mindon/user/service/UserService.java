package com.ssafy.mindon.user.service;

import com.ssafy.mindon.common.error.ErrorCode;
import com.ssafy.mindon.common.exception.AuthException;
import com.ssafy.mindon.common.exception.BusinessBaseException;
import com.ssafy.mindon.common.exception.NotFoundException;
import com.ssafy.mindon.group.repository.GroupRepository;
import com.ssafy.mindon.meeting.entity.Meeting;
import com.ssafy.mindon.meeting.repository.MeetingRepository;
import com.ssafy.mindon.user.dto.*;
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

    public SpeakerListDto getSpeakerList(Integer groupId,Set<String> userIds) {
//        List<SpeakerDto> speakerDtos = new ArrayList<>();
//        int no = 1;
//
//        for (String userId : userIds) {
//            User user = userRepository.findByUserId(userId);
//
//            if (user != null) {
//                speakerDtos.add(new SpeakerDto(no++, user.getUserId(), user.getUserName()));
//            }
//        }
//
//        return new SpeakerListDto(speakerDtos);
        List<Meeting> completedMeetings = meetingRepository.findByGroup_GroupIdAndMeetingStatusIn(groupId, List.of((byte) 2));
        List<Integer> meetingIds = completedMeetings.stream().map(Meeting::getMeetingId).toList();

        // 2. 완료된 meeting이 없으면 기존 userIds 그대로 반환
        if (meetingIds.isEmpty()) {
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

        // 3. userId별 평균 speech_amount 조회 후 리스트에 저장
        List<UserSpeechAmount> userSpeechAmounts = userIds.stream()
                .map(userId -> {
                    Double avgSpeechAmount = Optional.ofNullable(
                            userReviewRepository.findAvgSpeechAmountByUserIdAndMeetings(userId, meetingIds)
                    ).orElse(0.0); // null 방지

                    return new UserSpeechAmount(userId, avgSpeechAmount);
                })
                .sorted(Comparator.comparingDouble(UserSpeechAmount::getAvgSpeechAmount)) // 평균이 작은 순으로 정렬
                .toList();

        // 4. 정렬된 순서대로 no 값 부여하고 SpeakerDto 생성
        List<SpeakerDto> orderedSpeakerDtos = new ArrayList<>();
        int no = 1;
        for (UserSpeechAmount userSpeech : userSpeechAmounts) {
            User user = userRepository.findByUserId(userSpeech.getUserId());
            if (user != null) {
                orderedSpeakerDtos.add(new SpeakerDto(no++, user.getUserId(), user.getUserName())); // speechAmountAvg 제거
            }
        }

        return new SpeakerListDto(orderedSpeakerDtos);

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
