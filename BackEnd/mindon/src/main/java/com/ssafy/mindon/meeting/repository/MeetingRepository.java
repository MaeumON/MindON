package com.ssafy.mindon.meeting.repository;

import com.ssafy.mindon.meeting.entity.Meeting;
import com.ssafy.mindon.group.entity.Group;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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

}