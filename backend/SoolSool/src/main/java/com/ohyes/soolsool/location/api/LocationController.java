package com.ohyes.soolsool.location.api;

import com.ohyes.soolsool.location.application.LocationService;
import com.ohyes.soolsool.location.dto.LocationResponseDto;
import com.ohyes.soolsool.user.domain.User;
import com.ohyes.soolsool.util.MessageResponse;
import com.ohyes.soolsool.util.UserDetailsImpl;
import com.ohyes.soolsool.util.UserUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Location", description = "막차 관련 API document")
public class LocationController {

    private final LocationService locationService;

    // 개발 편의를 위해 @PathVariable 사용 이후 @AuthenticationPrincipal UserDetailsImpl userDetails 수정 필요
    @GetMapping("/v2/location")
    @Operation(summary = "막차 알림 시간 및 경로 조회",
        description = "30분 전 알림을 보내야 하는 시간과 자세한 경로 데이터를 반환합니다.")
    public ResponseEntity<Object> lastChanceGet(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            // 유저 DB에서 위치 가져오는 방식으로 변경할것
            User user = UserUtils.getUserFromToken(userDetails);
            LocationResponseDto locationResponseDto = locationService.getLastChance(user.getSocialId());
            return new ResponseEntity<>(locationResponseDto, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new MessageResponse(e.getMessage()),
                HttpStatus.BAD_REQUEST);
        }
    }
}
