package com.ohyes.soolsool.location.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.ohyes.soolsool.location.application.LocationService;
import com.ohyes.soolsool.location.dto.LocationRequestDto;
import com.ohyes.soolsool.util.MessageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Location", description = "막차 관련 API document")
public class LocationController {

    private final LocationService locationService;

    @PostMapping("/v2/location")
    public ResponseEntity<Object> lastChanceGet(@RequestBody LocationRequestDto locationRequestDto) {
        try {
            JsonNode resultMap = locationService.lastChanceGet(locationRequestDto);
            return new ResponseEntity<>(resultMap, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new MessageResponse(e.getMessage()),
                HttpStatus.BAD_REQUEST);
        }
    }
}
