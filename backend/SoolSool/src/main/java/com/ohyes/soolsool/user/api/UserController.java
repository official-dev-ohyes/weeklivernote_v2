package com.ohyes.soolsool.user.api;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.ohyes.soolsool.user.application.UserService;
import com.ohyes.soolsool.user.dao.UserRepository;
import com.ohyes.soolsool.user.domain.User;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/user")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    @GetMapping("/login")
    public ResponseEntity<Object> userLogin(@RequestParam String code) throws JsonProcessingException {
        Map<String, Object> data = userService.kakaoLogin(code);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }
}
