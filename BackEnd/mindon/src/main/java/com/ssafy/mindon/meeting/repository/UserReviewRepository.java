package com.ssafy.mindon.meeting.repository;

import com.ssafy.mindon.meeting.domain.UserReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserReviewRepository extends JpaRepository<UserReview, Long> {

    Optional<UserReview> findByEmotionId(Byte emotionId);
}
