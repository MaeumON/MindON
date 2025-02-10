package com.ssafy.mindon.meeting.repository;

import com.ssafy.mindon.meeting.entity.Meeting;
import com.ssafy.mindon.group.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, Integer> {

    Optional<Meeting> findByGroup_GroupIdAndMeetingStatus(int groupId, int meetingStatus);

}
