package com.ohyes.soolsool.location.dto;

import com.fasterxml.jackson.databind.JsonNode;
import java.util.List;
import java.util.Map;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LocationResponseDto {

    private String alarmTime;
    private JsonNode shortRoute;
    private List<Map<String, List<Double>>> subPaths;

    @Builder
    public LocationResponseDto(String alarmTime, JsonNode shortRoute,
        List<Map<String, List<Double>>> subPaths) {
        this.alarmTime = alarmTime;
        this.shortRoute = shortRoute;
        this.subPaths = subPaths;
    }
}
