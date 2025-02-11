package com.ssafy.mindon.report.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reasons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reason {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reason_id")
    private Byte reasonId;

    @Column(name = "reason_name", length = 10, nullable = false)
    private String reasonName;
}