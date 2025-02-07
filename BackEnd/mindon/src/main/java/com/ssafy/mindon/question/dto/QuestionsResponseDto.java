package com.ssafy.mindon.question.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class QuestionsResponseDto {
    private List<QuestionDto> data;
}
