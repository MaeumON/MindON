package com.ssafy.mindon.userreview.service;

import com.ssafy.mindon.common.error.ErrorCode;
import com.ssafy.mindon.common.exception.NotFoundException;
import com.ssafy.mindon.common.exception.GroupException;
import com.ssafy.mindon.userreview.dto.GroupReviewResponseDto;
import com.ssafy.mindon.group.entity.Group;
import com.ssafy.mindon.group.repository.GroupRepository;
import com.ssafy.mindon.meeting.entity.Meeting;
import com.ssafy.mindon.meeting.repository.MeetingRepository;
import com.ssafy.mindon.userreview.entity.UserReview;
import com.ssafy.mindon.userreview.repository.UserReviewRepository;
import com.ssafy.mindon.common.util.JwtUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroupReviewService {

    private final UserReviewRepository userReviewRepository;
    private final MeetingRepository meetingRepository;
    private final GroupRepository groupRepository;
    private final JwtUtil jwtUtil;

    public GroupReviewService(UserReviewRepository userReviewRepository,
                              MeetingRepository meetingRepository,
                              GroupRepository groupRepository,
                              JwtUtil jwtUtil) {
        this.userReviewRepository = userReviewRepository;
        this.meetingRepository = meetingRepository;
        this.groupRepository = groupRepository;
        this.jwtUtil = jwtUtil;
    }

    @Transactional(readOnly = true)
    public GroupReviewResponseDto getGroupReviews(String accessToken, Integer groupId) {
        String userId = jwtUtil.extractUserId(accessToken); // 토큰에서 userId 추출

        // 그룹 정보 조회 (period, progressWeeks)
        Group group = groupRepository.findByGroupId(groupId);
        if (group == null) {
            throw new NotFoundException(ErrorCode.GROUP_NOT_FOUND);
        }

        // 해당 그룹의 모든 미팅 데이터 가져오기
        List<Meeting> meetings = meetingRepository.findByGroup_GroupId(groupId);
        if (meetings.isEmpty()) {
            throw new GroupException(ErrorCode.MEETING_NOT_FOUND);
        }

        List<Integer> meetingIds = meetings.stream()
                .map(Meeting::getMeetingId)
                .collect(Collectors.toList());


        // 특정 사용자의 리뷰 데이터 가져오기
        List<UserReview> reviews = userReviewRepository.findByUserIdAndMeetingIdIn(userId, meetingIds);

        // 평균 감정 점수 계산
        Double emotionAvg = userReviewRepository.findEmotionAvgByUserIdAndMeetings(userId, meetingIds);
        int avgScore = (emotionAvg != null) ? emotionAvg.intValue() : 0;

        // DTO 변환
        List<GroupReviewResponseDto.ReviewData> reviewDataList = reviews.stream()
                .map(review -> {
                    Meeting meeting = meetings.stream()
                            .filter(m -> m.getMeetingId().equals(review.getMeetingId()))
                            .findFirst()
                            .orElse(null);
                    return new GroupReviewResponseDto.ReviewData(
                            review.getMeetingId(),
                            review.getUserId(),
                            review.getEmotionId(),
                            review.getSummation(),
                            review.getCheeringMessage(),
                            review.getSpeechAmount(),
                            (meeting != null) ? meeting.getDate() : null,
                            group.getPeriod(),
                            group.getProgressWeeks()
                    );
                })
                .collect(Collectors.toList());

        return new GroupReviewResponseDto(avgScore, reviewDataList);
    }
}
