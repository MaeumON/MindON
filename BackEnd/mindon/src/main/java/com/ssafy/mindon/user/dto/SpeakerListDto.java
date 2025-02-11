package com.ssafy.mindon.user.dto;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class SpeakerListDto {
    private List<SpeakerDto> data;
}
