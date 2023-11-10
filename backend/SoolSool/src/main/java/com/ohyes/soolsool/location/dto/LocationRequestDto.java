package com.ohyes.soolsool.location.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LocationRequestDto {

    @Schema(type = "number", format = "double", example = "35.106264217962284")
    private double nowLat;

    @Schema(type = "number", format = "double", example = "128.9665174484257")
    private double nowLong;

    @Schema(type = "number", format = "double", example = "35.23500167069489")
    private double homeLat;

    @Schema(type = "number", format = "double", example = "129.01787638664285")
    private double homeLong;

    @Builder
    public LocationRequestDto(double nowLat, double nowLong, double homeLat, double homeLong) {
        this.nowLat = nowLat;
        this.nowLong = nowLong;
        this.homeLat = homeLat;
        this.homeLong = homeLong;
    }
}
