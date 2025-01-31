package com.ssafy.mindon.disease.repository;

import com.ssafy.mindon.disease.entity.Disease;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiseaseRepository extends JpaRepository<Disease, Byte> {
    // 질병 데이터를 저장하거나 조회하는 JPA Repository
}