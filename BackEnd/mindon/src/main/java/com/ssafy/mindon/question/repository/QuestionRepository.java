package com.ssafy.mindon.question.repository;

import com.ssafy.mindon.question.dto.QuestionDto;
import com.ssafy.mindon.question.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
public interface QuestionRepository extends JpaRepository<Question, Integer> {
    List<QuestionDto> findFirst3ByCurriculumWeekOrderByQuestionId(byte curriculumWeek);
    List<QuestionDto> findByCurriculumWeekOrderByQuestionId(byte curriculumWeek);
}
