package com.ssafy.mindon.disease.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "diseases")
public class Disease {
    // 질병 정보를 나타내는 JPA 엔티티

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AUTO_INCREMENT
    @Column(name = "disease_id")
    private Byte diseaseId; // TINYINT

    @Column(name = "disease_name", nullable = false, length = 20)
    private String diseaseName;
}
