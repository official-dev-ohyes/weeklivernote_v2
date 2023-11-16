package com.ohyes.soolsool.gps.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GpsInfo {

    @Schema(type = "number", format = "double", example = "35.085747")
    private final double latitude;

    @Schema(type = "number", format = "double", example = "128.878013")
    private final double longitude;
}
