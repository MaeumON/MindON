package com.ssafy.mindon.emotion.repository;

import com.ssafy.mindon.emotion.entity.Emotion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmotionRepository extends JpaRepository<Emotion, Byte> {

}