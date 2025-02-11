package com.ssafy.mindon.report.service;

import com.ssafy.mindon.meeting.entity.Meeting;
import com.ssafy.mindon.meeting.repository.MeetingRepository;
import com.ssafy.mindon.report.entity.Reason;
import com.ssafy.mindon.report.entity.Report;
import com.ssafy.mindon.report.repository.ReasonRepository;
import com.ssafy.mindon.report.repository.ReportRepository;
import com.ssafy.mindon.user.entity.User;
import com.ssafy.mindon.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ReportService {
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final ReasonRepository reasonRepository;
    private final MeetingRepository meetingRepository;

    public ReportService(ReportRepository reportRepository, UserRepository userRepository, ReasonRepository reasonRepository, MeetingRepository meetingRepository) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.reasonRepository = reasonRepository;
        this.meetingRepository = meetingRepository;
    }

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
    }
}