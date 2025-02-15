package com.ssafy.mindon.group.scheduler;

import com.ssafy.mindon.group.service.GroupService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class GroupStatusScheduler {

    private final GroupService groupService;
    @Scheduled(cron = "0 0 * * * ?")  // 매 정각 실행
    public void scheduleUpdateGroupStatusToOngoing() {
        try {
            log.info("그룹 상태 업데이트 시작 (진행 중)");
            int updatedCount = groupService.updateGroupStatusToOngoing();
            log.info("진행 중으로 변경된 그룹 개수: {}, 실행 시각: {}",
                    updatedCount, LocalDateTime.now());
            if (updatedCount > 0) {
                log.info("진행 중으로 변경된 그룹 개수: {}", updatedCount);
            }
        } catch (Exception e) {
            log.error("진행 중으로 변경하는 중 오류 발생: {}", e.getMessage(), e);
        }
    }

    @Scheduled(cron = "0 0 * * * ?")
    public void scheduleUpdateGroupStatusToEnded() {
        try {
            int updatedCount = groupService.updateGroupStatusToEnded();
            if (updatedCount > 0) {
                log.info("종료된 그룹 개수: {}", updatedCount);
            }
        } catch (Exception e) {
            log.error("종료 상태로 변경하는 중 오류 발생: {}", e.getMessage(), e);
        }
    }
    @Scheduled(cron = "0 0 * * * ?")
    public void scheduleUpdateProgressWeeks() {
        try {
            int updatedCount = groupService.updateProgressWeeks();
            if (updatedCount > 0) {
                log.info("progress_weeks 증가된 그룹 개수: {}", updatedCount);
            }
        } catch (Exception e) {
            log.error("progress_weeks 업데이트 중 오류 발생: {}", e.getMessage(), e);
        }
    }
}
