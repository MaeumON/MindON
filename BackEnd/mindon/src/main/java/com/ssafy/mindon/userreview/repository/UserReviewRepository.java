package com.ssafy.mindon.userreview.repository;

import com.ssafy.mindon.userreview.entity.UserReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserReviewRepository extends JpaRepository<UserReview, Long> {
    List<UserReview> findByUserIdAndMeetingIdIn(String userId, List<Integer> meetingIds);
}
