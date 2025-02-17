package com.ssafy.mindon.meeting.repository;

import com.ssafy.mindon.meeting.entity.Meeting;
import com.ssafy.mindon.group.entity.Group;
import org.springframework.data.jpa.repository.EntityGraph;
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
public interface MeetingRepository extends JpaRepository<Meeting, Integer> {

    @EntityGraph(attributePaths = {"group"})
    Optional<Meeting> findByGroup_GroupIdAndMeetingStatus(int groupId, int meetingStatus);

    @EntityGraph(attributePaths = {"group", "group.disease"})
    Optional<Meeting> findFirstByGroup_GroupIdInAndMeetingStatusInAndDateGreaterThanEqualOrderByDate(
            List<Integer> groupIds,
            List<Byte> meetingStatus,
            LocalDateTime currentDate
    );

    // 진행 중(`meeting_status = 1`)인 회의를 찾기 (시간 비교 없음)
    Optional<Meeting> findFirstByGroup_GroupIdInAndMeetingStatusOrderByDate(
            List<Integer> groupIds, byte meetingStatus);
    Optional<Meeting> findFirstByGroup_GroupIdInAndMeetingStatusAndDateGreaterThanEqualOrderByDate(
            List<Integer> groupIds, byte meetingStatus, LocalDateTime date);

    List<Meeting> findAllByGroup_GroupIdIn(List<Integer> joinedGroupIds);
    List<Meeting> findByGroup_GroupIdIn(List<Integer> groupIds); // 위에거로 되면 삭제 가능

    List<Meeting> findByGroup_GroupId(Integer groupId);
    List<Meeting> findByGroup_GroupIdAndMeetingStatusIn(Integer groupId, List<Byte> meetingStatus);

    @Modifying(clearAutomatically = true)
    @Transactional
    @Query(value = """
        UPDATE meetings
        SET meeting_status = CASE
            WHEN meeting_status = 0 AND NOW() >= date THEN 1
            WHEN meeting_status = 1 AND NOW() >= DATE_ADD(date, INTERVAL 1 HOUR) THEN 2
            ELSE meeting_status
        END
        WHERE meeting_status < 2
    """, nativeQuery = true)
    int updateMeetingStatus();

    @Query("SELECT m FROM Meeting m " +
            "WHERE m.group.groupId = :groupId " +
            "AND (m.meetingStatus = 0 OR m.meetingStatus = 1) " +
            "ORDER BY m.date ASC LIMIT 1")
    Meeting findNearestUpcomingOrOngoingMeeting(@Param("groupId") Integer groupId);

}