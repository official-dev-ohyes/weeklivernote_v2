package com.ohyes.soolsool.location.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LocationRequestDto {

    private double nowLat;
    private double nowLong;
    private double homeLat;
    private double homeLong;

    @Builder
    public LocationRequestDto(double nowLat, double nowLong, double homeLat, double homeLong) {
        this.nowLat = nowLat;
        this.nowLong = nowLong;
        this.homeLat = homeLat;
        this.homeLong = homeLong;
    }
}
