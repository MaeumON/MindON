package com.ssafy.mindon.meeting.scheduler;

import com.ssafy.mindon.meeting.service.MeetingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class MeetingStatusScheduler {

    private final MeetingService meetingService;

    /**
     * meeting_status 업데이트 스케줄러
     * - 매 정각(1시간마다) 실행됨
     * - meeting_status 0 → 1 (현재 시간이 meeting 시작 시간 이상인 경우)
     * - meeting_status 1 → 2 (현재 시간이 meeting 시작 시간 + 50분 이상인 경우)
     */
//    @Scheduled(cron = "0 0,50 * * * ?")  // 매 정각과 50분에 실행
    @Scheduled(cron = "0 * * * * ?")

    public void scheduleUpdateMeetingStatus() {
        try {
            int updatedCount = meetingService.updateMeetingStatus();
            if (updatedCount > 0) {
                log.info("업데이트된 미팅 상태 개수: {}", updatedCount);
            }
        } catch (Exception e) {
            log.error("미팅 상태 업데이트 중 오류 발생: {}", e.getMessage(), e);
        }
    }
}
