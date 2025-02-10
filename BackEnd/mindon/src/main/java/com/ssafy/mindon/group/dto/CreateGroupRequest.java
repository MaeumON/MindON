package com.ssafy.mindon.group.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonFormat;


import java.time.LocalDateTime;

@Getter
@Setter
public class CreateGroupRequest {

    @NotBlank
    @Size(max = 15)
    private String title;

    @NotNull
    @Min(1)
    private Integer diseaseId;

    @NotNull
    private Boolean isPrivate;

    @Size(max = 4)
    private String privatePassword;

    @NotNull
    private Integer period;

    @NotNull
    private Integer meetingTime;

    @NotNull
    private Integer dayOfWeek;

    @NotNull
    private Integer minMembers;

    @NotNull
    private Integer maxMembers;

    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
    private LocalDateTime startDate;


    private String description;

    private Boolean isHost;
}
