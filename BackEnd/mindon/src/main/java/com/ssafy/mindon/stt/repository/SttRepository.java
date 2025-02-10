package com.ssafy.mindon.stt.repository;

import com.ssafy.mindon.stt.entity.Stt;
import com.ssafy.mindon.stt.entity.SttId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SttRepository extends JpaRepository<Stt, SttId> {

    List<Stt> findByUserUserIdAndMeetingMeetingId(String userId, Integer meetingId);

    List<Stt> findByMeetingMeetingId(Integer meetingId);
}
