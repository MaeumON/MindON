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

    // JPQL을 사용
    @Query("SELECT s FROM Stt s WHERE s.user.userId = :userId AND s.meeting.meetingId = :meetingId")
    List<Stt> findByUserIdAndMeetingId(@Param("userId") String userId, @Param("meetingId") Integer meetingId);

    @Query("SELECT s FROM Stt s WHERE s.meeting.meetingId = :meetingId")
    List<Stt> findByMeetingId(Integer meetingId);
}
