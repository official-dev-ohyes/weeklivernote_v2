package com.ohyes.soolsool.sample.application;

import com.ohyes.soolsool.sample.dto.SampleResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class SampleService {

    public SampleResponseDto getSampleDetail() {
        return SampleResponseDto.builder()
            .content("SampleDetail 더미 데이터")
            .idx(1)
            .build();
    }
}
