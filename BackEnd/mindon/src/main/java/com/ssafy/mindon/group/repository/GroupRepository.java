package com.ssafy.mindon.group.repository;

import com.ssafy.mindon.group.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface GroupRepository extends JpaRepository<Group, Integer> {
    boolean existsByInviteCode(String inviteCode);

    // 특정 파라미터가 NULL이면 해당 조건을 무시하고 다른 조건들만 적용
    @Query("SELECT g FROM Group g WHERE " +
            "(:keyword IS NULL OR g.title LIKE %:keyword% OR g.inviteCode LIKE %:keyword%) AND " +
            "(:diseaseId IS NULL OR g.disease.diseaseId IN :diseaseId) AND " +
            "(:isHost IS NULL OR g.isHost = :isHost) AND " +
            "(:startDate IS NULL OR g.startDate >= :startDate) AND " +
            "(:period IS NULL OR g.period = :period) AND " +
            "(:startTime IS NULL OR g.meetingTime >= :startTime) AND " +
            "(:endTime IS NULL OR g.meetingTime <= :endTime) AND " +
            "(:dayOfWeek IS NULL OR g.dayOfWeek IN :dayOfWeek)")
    List<Group> findGroupsByCriteria(
            @Param("keyword") String keyword,
            @Param("diseaseId") List<Byte> diseaseId,
            @Param("isHost") Boolean isHost,
            @Param("startDate") LocalDateTime startDate,
            @Param("period") Byte period,
            @Param("startTime") Byte startTime,
            @Param("endTime") Byte endTime,
            @Param("dayOfWeek") List<Byte> dayOfWeek
    );

}
