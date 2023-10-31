package com.ohyes.soolsool.user.api;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.ohyes.soolsool.user.application.UserService;
import com.ohyes.soolsool.user.application.UserStatService;
import com.ohyes.soolsool.user.dto.UserStatResponseDto;
import com.ohyes.soolsool.util.MessageResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserStatService userStatService;

    @GetMapping("v1/user/login")
    public ResponseEntity<Object> userLogin(@RequestParam String code) throws JsonProcessingException {
        Map<String, Object> data = userService.kakaoLogin(code);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping("v1/user/stat")
    public ResponseEntity<Object> userStatGet() {
        try {
            Long socialId = 1L;

            UserStatResponseDto userStatResponseDto = userStatService.getUserStat(socialId);
            return new ResponseEntity<>(userStatResponseDto, HttpStatus.OK);
        } catch (NullPointerException e) {
            return new ResponseEntity<>(new MessageResponse(e.getMessage()), HttpStatus.NOT_FOUND);
        }
    }
}
