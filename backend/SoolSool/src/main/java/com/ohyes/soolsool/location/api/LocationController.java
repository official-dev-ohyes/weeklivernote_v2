package com.ohyes.soolsool.location.api;

import com.ohyes.soolsool.location.application.LocationService;
import com.ohyes.soolsool.location.dto.LocationResponseDto;
import com.ohyes.soolsool.util.MessageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Location", description = "막차 관련 API document")
public class LocationController {

    private final LocationService locationService;

    // 개발 편의를 위해 @PathVariable 사용 이후 @AuthenticationPrincipal UserDetailsImpl userDetails 수정 필요
    @GetMapping("/v2/location/{socialId}")
    @Operation(summary = "막차 알림 시간 및 경로 조회",
        description = "30분 전 알림을 보내야 하는 시간과 자세한 경로 데이터를 반환합니다.")
    public ResponseEntity<Object> lastChanceGet(@PathVariable String socialId) {
        try {
            // 유저 DB에서 위치 가져오는 방식으로 변경할것

            LocationResponseDto locationResponseDto = locationService.getLastChance(socialId);
            return new ResponseEntity<>(locationResponseDto, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new MessageResponse(e.getMessage()),
                HttpStatus.BAD_REQUEST);
        }
    }
}
