package com.ssafy.mindon.question.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_id")
    private Integer questionId;

    @Column(name = "curriculum_week", nullable = false)
    private Byte curriculumWeek;  // TINYINT 에 대응 (1~8)

    @Column(name = "detail", nullable = false, columnDefinition = "TEXT")
    private String detail;

}
