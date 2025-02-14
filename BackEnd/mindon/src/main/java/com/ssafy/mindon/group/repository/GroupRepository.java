package com.ssafy.mindon.group.repository;

import com.ssafy.mindon.group.entity.Group;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface GroupRepository extends JpaRepository<Group, Integer> {
    boolean existsByInviteCode(String inviteCode);

    // 특정 파라미터가 NULL이면 해당 조건을 무시하고 다른 조건들만 적용
    @Query("SELECT g FROM Group g WHERE g.groupStatus = 0 AND " +
            "(:keyword IS NULL OR g.title LIKE %:keyword%) AND " +
            "(:diseaseId IS NULL OR g.disease.diseaseId IN :diseaseId) AND " +
            "(:isHost IS NULL OR g.isHost = :isHost) AND " +
            "(:startDate IS NULL OR g.startDate >= :startDate) AND " +
            "(:period IS NULL OR g.period = :period) AND " +
            "(:startTime IS NULL OR g.meetingTime >= :startTime) AND " +
            "(:endTime IS NULL OR g.meetingTime <= :endTime) AND " +
            "(:dayOfWeek IS NULL OR g.dayOfWeek IN :dayOfWeek)"+
            "ORDER BY g.startDate ASC, g.groupId ASC")
    Page<Group> findGroupsByCriteria(
            @Param("keyword") String keyword,
            @Param("diseaseId") List<Byte> diseaseId,
            @Param("isHost") Boolean isHost,
            @Param("startDate") LocalDateTime startDate,
            @Param("period") Byte period,
            @Param("startTime") Byte startTime,
            @Param("endTime") Byte endTime,
            @Param("dayOfWeek") List<Byte> dayOfWeek,
            Pageable pageable
    );

    void deleteByGroupId(int groupId);

    List<Group> findTop5ByDiseaseDiseaseIdAndGroupStatusOrderByCreatedDateDesc(Byte diseaseId, Byte groupStatus);

    long countByGroupIdInAndGroupStatus(List<Integer> groupIds, byte groupStatus);

    List<Group> findAllByGroupIdIn(List<Integer> groupIds);

    Group findByGroupId(Integer groupId);

    Page<Group> findByInviteCode(String inviteCode, Pageable pageable);

    @Modifying(clearAutomatically = true)  // 변경 사항을 영속성 컨텍스트에 즉시 반영
    @Transactional
    @Query(value = "UPDATE `groups` " +
            "SET group_status = 1 " +
            "WHERE start_date <= :now " +
            "AND group_status = 0",
            nativeQuery = true)
    int updateGroupStatusToOngoing(@Param("now") LocalDateTime now);

    @Modifying(clearAutomatically = true)
    @Transactional
    @Query(value = "UPDATE `groups` " +
            "SET group_status = 2 " +
            "WHERE DATE_ADD(end_date, INTERVAL 1 HOUR) < :now " +
            "AND group_status = 1",
            nativeQuery = true)
    int updateGroupStatusToEnded(@Param("now") LocalDateTime now);


    @Query("SELECT g FROM Group g WHERE g.groupId IN :groupIds " +
            "AND g.groupStatus = :groupStatus " +
            "AND (:keyword IS NULL OR g.title LIKE %:keyword% OR g.inviteCode LIKE %:keyword%)")
    Page<Group> findGroupsByKeywordAndStatus(@Param("groupIds") List<Integer> groupIds,
                                             @Param("groupStatus") Byte groupStatus,
                                             @Param("keyword") String keyword,
                                             Pageable pageable
    );

    @Modifying(clearAutomatically = true)
    @Transactional
    @Query(value = "UPDATE `groups` " +
            "SET progress_weeks = progress_weeks + 1 " +
            "WHERE progress_weeks < period " +
            "AND NOW() >= DATE_ADD(start_date, INTERVAL progress_weeks WEEK)",
            nativeQuery = true)
    int updateProgressWeeks();
}