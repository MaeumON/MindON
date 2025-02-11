package com.ssafy.mindon.report.repository;

import com.ssafy.mindon.meeting.entity.Meeting;
import com.ssafy.mindon.report.entity.Report;
import com.ssafy.mindon.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReportRepository extends JpaRepository<Report, Integer> {
    Optional<Report> findByReportingUserAndReportedUserAndMeeting(User reportingUser, User reportedUser, Meeting meeting);
}
