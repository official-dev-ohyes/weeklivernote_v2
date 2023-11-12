package com.ohyes.soolsool.gps.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NowGpsInfo {

    @Schema(type = "number", format = "double", example = "35.085747")
    private final double nowLatitude;

    @Schema(type = "number", format = "double", example = "128.878013")
    private final double nowLongitude;
}
