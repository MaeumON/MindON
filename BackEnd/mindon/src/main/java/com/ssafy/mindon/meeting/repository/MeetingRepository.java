package com.ssafy.mindon.meeting.repository;

import com.ssafy.mindon.meeting.entity.Meeting;
import com.ssafy.mindon.group.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, Integer> {

}
