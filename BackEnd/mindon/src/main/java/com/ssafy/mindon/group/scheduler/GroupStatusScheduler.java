package com.ssafy.mindon.group.scheduler;

import com.ssafy.mindon.group.service.GroupService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class GroupStatusScheduler {

    private final GroupService groupService;

    @Scheduled(cron = "0 0 * * * ?")  // 매 정각 실행
    public void scheduleUpdateGroupStatusToOngoing() {
        try {
            int updatedCount = groupService.updateGroupStatusToOngoing();
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
}
