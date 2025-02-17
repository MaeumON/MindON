package com.ssafy.mindon.meeting.service;

import com.ssafy.mindon.common.error.ErrorCode;
import com.ssafy.mindon.common.exception.MeetingException;
import com.ssafy.mindon.disease.entity.Disease;
import com.ssafy.mindon.group.entity.Group;
import com.ssafy.mindon.group.repository.GroupRepository;
import com.ssafy.mindon.meeting.dto.UpcomingMeetingResponseDto;
import com.ssafy.mindon.meeting.entity.Meeting;
import com.ssafy.mindon.meeting.repository.MeetingRepository;
import com.ssafy.mindon.question.dto.QuestionDto;
import com.ssafy.mindon.question.repository.QuestionRepository;
import com.ssafy.mindon.usergroup.repository.UserGroupRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class MeetingService {

    private final MeetingRepository meetingRepository;
    private final QuestionRepository questionRepository;

    private final UserGroupRepository userGroupRepository;
    private final GroupRepository groupRepository;

    @Transactional(readOnly = true)
    public UpcomingMeetingResponseDto getUpcomingMeetingDto(String userId) {
        List<Integer> groupIds = userGroupRepository.findByUser_UserId(userId)
                .stream()
                .map(userGroup -> userGroup.getGroup().getGroupId())
                .collect(Collectors.toList());

        if (groupIds.isEmpty()) {
            return null;
        }

        // meetingStatus = 1
        Optional<Meeting> activeMeeting = meetingRepository
                .findFirstByGroup_GroupIdInAndMeetingStatusOrderByDate(groupIds, (byte) 1);


        System.out.println("Active meeting found: " + activeMeeting.isPresent());
        activeMeeting.ifPresent(meeting ->
                System.out.println("Meeting ID: " + meeting.getMeetingId() + ", Date: " + meeting.getDate())
        );

        // meetingStatus = 1 인 회의가 없으면 meetingStatus = 0
        Meeting upcomingMeeting = activeMeeting.orElseGet(() ->
                meetingRepository
                        .findFirstByGroup_GroupIdInAndMeetingStatusAndDateGreaterThanEqualOrderByDate(
                                groupIds,
                                (byte) 0,  // 예정된 회의
                                LocalDateTime.now()
                        ).orElse(null)
        );

        if (upcomingMeeting == null) {
            return null;
        }

        Group group = upcomingMeeting.getGroup();
        Disease disease = group.getDisease();

        return UpcomingMeetingResponseDto.builder()
                .title(group.getTitle())
                .groupId(group.getGroupId())
                .meetingTime(group.getMeetingTime().intValue())
                .diseaseId(disease.getDiseaseId().intValue())
                .diseaseName(disease.getDiseaseName())
                .meetingDate(upcomingMeeting.getDate())
                .meetingStatus(upcomingMeeting.getMeetingStatus())
                .build();
    }

    public List<QuestionDto> getMeetingQuestions(Integer meetingId) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new MeetingException(ErrorCode.MEETING_NOT_FOUND));

        byte meetingWeek = meeting.getMeetingWeek();
        byte period = meeting.getGroup().getPeriod();
        List<QuestionDto> questions = new ArrayList<>();

        // 시작 메시지 추가
        questions.add(new QuestionDto(100, "간단하게 오늘의 다짐을 말해볼까요??"));

        // 중간 질문들 가져오기
        List<QuestionDto> middleQuestions;
        if (meetingWeek == 1) {
            middleQuestions = questionRepository.findFirst3ByCurriculumWeekOrderByQuestionId((byte) 1);
        } else if (meetingWeek == period || meetingWeek == 8) {
            middleQuestions = questionRepository.findFirst3ByCurriculumWeekOrderByQuestionId((byte) 3);
        } else {
            // 중간 주 로직
            List<QuestionDto> allQuestions = questionRepository.findByCurriculumWeekOrderByQuestionId((byte) 2);

            if (allQuestions.size() < 21) {  // 최소 21개 체크
                throw new MeetingException(ErrorCode.MEETING_Question_NOT_FOUND);
            }

            int totalMiddleWeeks = (period == 8) ? 6 : (period - 2);
            int questionsPerWeek = allQuestions.size() / totalMiddleWeeks;

            int startIndex = (meetingWeek - 2) * questionsPerWeek;
            //startIndex = Math.min(startIndex, allQuestions.size() - 1);
            int endIndex = Math.min((meetingWeek - 1) * questionsPerWeek, allQuestions.size());

            if (meetingWeek == totalMiddleWeeks + 1) {
                endIndex = allQuestions.size();
            }

            List<QuestionDto> weekQuestions = allQuestions.subList(startIndex, endIndex);
            Collections.shuffle(weekQuestions);
            middleQuestions = weekQuestions.stream()
                    .limit(3)
                    .collect(Collectors.toList());

            // 만약 중간 주 질문이 3개 미만이면 추가 확보
            if (middleQuestions.size() < 3) {
                List<QuestionDto> additionalQuestions = new ArrayList<>(allQuestions);
                additionalQuestions.removeAll(middleQuestions);
                Collections.shuffle(additionalQuestions);
                middleQuestions.addAll(additionalQuestions.stream()
                        .limit(3 - middleQuestions.size())
                        .collect(Collectors.toList()));
            }
        }

        questions.addAll(middleQuestions);
        questions.add(new QuestionDto(101, "오늘 모임에 대한 소감을 말해볼까요?"));
        return questions;
    }

    public Integer getOngoingMeetingId(Integer groupId) {
        boolean groupExists = groupRepository.existsById(groupId);
        if (!groupExists) {
            throw new IllegalArgumentException("해당 groupId(" + groupId + ")가 존재하지 않습니다.");
        }

        Optional<Meeting> meeting = meetingRepository.findByGroup_GroupIdAndMeetingStatus(groupId, 1);

        if (meeting.isEmpty()) {
            System.out.println("Meeting not found for groupId: " + groupId);
            throw new IllegalArgumentException("해당 groupId(" + groupId + ")에 대한 진행 중인 미팅이 존재하지 않습니다.");
        }

        return meeting.get().getMeetingId();
    }


    @Transactional
    public int updateMeetingStatus() {
        return meetingRepository.updateMeetingStatus();
    }
}
