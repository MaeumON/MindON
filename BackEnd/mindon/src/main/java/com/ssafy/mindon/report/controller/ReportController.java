package com.ssafy.mindon.report.controller;

import com.ssafy.mindon.common.util.JwtUtil;
import com.ssafy.mindon.report.dto.ReportRequest;
import com.ssafy.mindon.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    private final JwtUtil jwtUtil; // JwtUtil 주입

    @PostMapping
    public ResponseEntity<String> reportUser(
            @RequestHeader("Authorization") String accessToken,
            @RequestBody ReportRequest request
    ) {
        jwtUtil.validateToken(accessToken);
        String reportingUserId = jwtUtil.extractUserId(accessToken);

        // 신고 처리
        reportService.reportUser(reportingUserId, request.getReportedUserId(),
                request.getReasonId(), request.getReason(), request.getMeetingId());

        return ResponseEntity.ok("신고가 정상적으로 접수되었습니다.");
    }
}
