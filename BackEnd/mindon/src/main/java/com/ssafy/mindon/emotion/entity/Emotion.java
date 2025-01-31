package com.ssafy.mindon.emotion.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data // Lombok을 사용하여 getter, setter 자동 생성
@Table(name = "emotions")
public class Emotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 자동 증가
    @Column(name = "emotion_id")
    private Byte emotionId;

    @Column(name = "emotion", nullable = false, length = 20)
    private String emotion;
}
