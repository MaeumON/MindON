package com.ssafy.mindon.meeting.repository;

import com.ssafy.mindon.meeting.entity.Meeting;
import com.ssafy.mindon.group.entity.Group;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, Integer> {

    @EntityGraph(attributePaths = {"group"})
    Optional<Meeting> findByGroup_GroupIdAndMeetingStatus(int groupId, int meetingStatus);

    @EntityGraph(attributePaths = {"group", "group.disease"})
    Optional<Meeting> findFirstByGroup_GroupIdInAndMeetingStatusAndDateGreaterThanEqualOrderByDate(
            List<Integer> groupIds,
            byte meetingStatus,
            LocalDateTime currentDate
    );
}
