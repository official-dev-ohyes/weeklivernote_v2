package com.ohyes.soolsool.user.api;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.ohyes.soolsool.user.application.UserService;
import com.ohyes.soolsool.user.dto.KakaoProfileDto;
import com.ohyes.soolsool.user.dto.UserRequestDto;
import com.ohyes.soolsool.user.dto.UserResponseDto;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("v1/user/login")
    public ResponseEntity<Object> userLogin(@RequestParam String code)
        throws JsonProcessingException {
        KakaoProfileDto kakaoProfileDto = userService.kakaoLogin(code);
        Map<String, Object> data = userService.registerKakaoUser(kakaoProfileDto);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @PatchMapping("/v1/user")
    public ResponseEntity<Object> userInfoAdd(@RequestBody UserRequestDto userRequestDto) {
        Long socialId = 1L;

        Map<String, Object> data = userService.userInfoAdd(userRequestDto, socialId);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping("/v1/user/info")
    public ResponseEntity<Object> userInfoGet() {
        Long socialId = 1L;

        UserResponseDto userResponseDto = userService.userInfoGet(socialId);
        return new ResponseEntity<>(userResponseDto, HttpStatus.OK);
    }
}
