package com.ohyes.soolsool.location.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LocationRequestDto {

    @Schema(type = "number", format = "double", example = "37.58735447069855")
    private double nowLat;

    @Schema(type = "number", format = "double", example = "126.95656093597447")
    private double nowLong;

    @Schema(type = "number", format = "double", example = "37.550079720522426")
    private double homeLat;

    @Schema(type = "number", format = "double", example = "126.9164657592777")
    private double homeLong;

    @Builder
    public LocationRequestDto(double nowLat, double nowLong, double homeLat, double homeLong) {
        this.nowLat = nowLat;
        this.nowLong = nowLong;
        this.homeLat = homeLat;
        this.homeLong = homeLong;
    }
}
