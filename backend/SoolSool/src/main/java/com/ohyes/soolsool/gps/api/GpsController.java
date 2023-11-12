package com.ohyes.soolsool.gps.api;

import com.ohyes.soolsool.gps.application.GpsService;
import com.ohyes.soolsool.gps.dto.GpsInfo;
import com.ohyes.soolsool.location.dto.AlarmTime;
import com.ohyes.soolsool.user.domain.User;
import com.ohyes.soolsool.util.UserDetailsImpl;
import com.ohyes.soolsool.util.UserUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Tag(name = "GPS", description = "사용자 위치 관련 API document")
public class GpsController {

    private final GpsService gpsService;

    @PatchMapping("/v2/gps")
    @Operation(summary = "사용자 현재 위치 정보 저장",
        description = "사용자의 현재 위치의 위도, 경도 정보를 저장합니다.")
    public ResponseEntity<Object> nowGpsInfoAdd(
        @AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody GpsInfo gpsInfo)
        throws Exception {
        User user = UserUtils.getUserFromToken(userDetails);
        AlarmTime alarmTime = gpsService.addUserNowGpsInfo(user, gpsInfo);
        return new ResponseEntity<>(alarmTime, HttpStatus.CREATED);
    }
}
