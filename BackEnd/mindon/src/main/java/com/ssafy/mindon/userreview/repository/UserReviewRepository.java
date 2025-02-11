package com.ssafy.mindon.userreview.repository;

import com.ssafy.mindon.meeting.entity.Meeting;
import com.ssafy.mindon.userreview.entity.UserReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserReviewRepository extends JpaRepository<UserReview, Long> {
    List<UserReview> findByUserIdAndMeetingIdIn(String userId, List<Integer> meetingIds);

    // 유효한 emotionId가 없을 땐 예외처리를 위해 999 반환
    @Query("""
                SELECT 
                    CASE 
                        WHEN COUNT(ur.emotionId) = 0 THEN 999
                        ELSE AVG(
                            CASE 
                                WHEN ur.emotionId IN (1, 2, 3) THEN 2
                                WHEN ur.emotionId = 4 THEN 1
                                WHEN ur.emotionId IN (5, 6, 7, 8) THEN -2
                                ELSE 0
                            END
                        )
                    END
                FROM UserReview ur
                WHERE ur.userId = :userId 
                AND ur.meetingId IN :meetings
                AND ur.emotionId != 0
            """)
    Double findEmotionAvgByUserIdAndMeetings(@Param("userId") String userId, @Param("meetings") List<Integer> meetings);
}