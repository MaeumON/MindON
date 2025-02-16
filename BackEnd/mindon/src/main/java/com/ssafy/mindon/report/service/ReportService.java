package com.ssafy.mindon.report.service;

import com.ssafy.mindon.meeting.entity.Meeting;
import com.ssafy.mindon.meeting.repository.MeetingRepository;
import com.ssafy.mindon.report.dto.ReportReasonDto;
import com.ssafy.mindon.report.entity.Reason;
import com.ssafy.mindon.report.entity.Report;
import com.ssafy.mindon.report.repository.ReasonRepository;
import com.ssafy.mindon.report.repository.ReportRepository;
import com.ssafy.mindon.user.dto.ReportedUserResponseDto;
import com.ssafy.mindon.user.entity.User;
import com.ssafy.mindon.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final ReasonRepository reasonRepository;
    private final MeetingRepository meetingRepository;

    @Transactional
    public void reportUser(String reportingUserId, String reportedUserId, Integer reasonId, String reason, Integer meetingId) {
        User reportingUser = userRepository.findById(reportingUserId).orElseThrow(() -> new RuntimeException("Reporting user not found"));
        User reportedUser = userRepository.findById(reportedUserId).orElseThrow(() -> new RuntimeException("Reported user not found"));
        Reason reasonEntity = reasonRepository.findById(reasonId.byteValue()).orElseThrow(() -> new RuntimeException("Reason not found"));
        Meeting meeting = meetingRepository.findById(meetingId).orElseThrow(() -> new RuntimeException("Meeting not found"));
        Optional<Report> existingReport = reportRepository.findByReportingUserAndReportedUserAndMeeting(
                reportingUser, reportedUser, meeting
        );

        if (existingReport.isPresent()) {
            throw new RuntimeException("You have already reported this user for this meeting");
        }

        Report report = Report.builder()
                .reportingUser(reportingUser)
                .reportedUser(reportedUser)
                .reasonEntity(reasonEntity)
                .reason(reason)
                .meeting(meeting)
                .createdDate(LocalDateTime.now())
                .build();

        reportRepository.save(report);

        // 신고당한 유저 신고 횟수 증가
        reportedUser.setReportedCnt(reportedUser.getReportedCnt() + 1);

        // 신고 횟수가 3 이상이면 정지 처리
        if (reportedUser.getReportedCnt() >= 3) {
            reportedUser.setUserStatus((byte) 2); // 정지 상태
        }
    }

    public List<ReportReasonDto> getReportsByReportedUserId(String userId){
        List<Report> reportList = reportRepository.findAllByReportedUserUserId(userId);

        return reportList.stream()
                .map(report -> new ReportReasonDto(
                        report.getReasonEntity().getReasonId().intValue(),
                        report.getReasonEntity().getReasonName(),
                        report.getReason()
                ))
                .collect(Collectors.toList());
    }
}