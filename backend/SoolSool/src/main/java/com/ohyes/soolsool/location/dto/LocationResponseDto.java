package com.ohyes.soolsool.location.dto;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LocationResponseDto {

    private String alarmTime;
    private JsonNode shortRoute;

    @Builder
    public LocationResponseDto(String alarmTime, JsonNode shortRoute) {
        this.alarmTime = alarmTime;
        this.shortRoute = shortRoute;
    }
}
