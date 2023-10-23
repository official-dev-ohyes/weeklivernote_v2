package com.ohyes.soolsool.sample.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SampleResponseDto {

    private String content;
    private int idx;
}
