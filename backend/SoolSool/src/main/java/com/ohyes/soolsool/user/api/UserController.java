package com.ohyes.soolsool.user.api;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.ohyes.soolsool.user.application.UserService;
import com.ohyes.soolsool.user.application.UserStatService;
import com.ohyes.soolsool.user.dto.KakaoProfileDto;
import com.ohyes.soolsool.user.dto.UserModifyDto;
import com.ohyes.soolsool.user.dto.UserRequestDto;
import com.ohyes.soolsool.user.dto.UserResponseDto;
import com.ohyes.soolsool.user.dto.UserStatResponseDto;
import com.ohyes.soolsool.util.MessageResponse;
import com.ohyes.soolsool.util.UserDetailsImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@Tag(name = "User", description = "유저 관련 API document")
public class UserController {

    private final UserService userService;
    private final UserStatService userStatService;

    // 회원가입 or 로그인
    @GetMapping("v1/user/login")
    @Operation(summary = "카카오 소셜 로그인",
        description = "이미 회원 정보가 있으면 로그인 없으면 회원가입 진행하고 추가 정보 입력 필요합니다.")
    public ResponseEntity<Object> userLogin(@RequestParam String code)
        throws JsonProcessingException {
        KakaoProfileDto kakaoProfileDto = userService.kakaoLogin(code);
        Map<String, Object> data = userService.registerKakaoUser(kakaoProfileDto);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    // 회원 추가 정보 입력
    @PatchMapping("/v1/user")
    @Operation(summary = "회원 추가 정보 입력",
        description = "회원가입 후 회원 추가 정보를 입력합니다.")
    public ResponseEntity<Object> userInfoAdd(@RequestBody UserRequestDto userRequestDto) {
        Long socialId = 1L;

        Map<String, Object> data = userService.userInfoAdd(userRequestDto, socialId);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    // 회원 추가 정보 조회
    @GetMapping("/v1/user/info")
    @Operation(summary = "회원 추가 정보 조회",
        description = "등록 되어있는 회원 추가 정보를 조회합니다.")
    public ResponseEntity<Object> userInfoGet() {
        Long socialId = 1L;

        UserResponseDto userResponseDto = userService.userInfoGet(socialId);
        return new ResponseEntity<>(userResponseDto, HttpStatus.OK);
    }

    // 회원 추가 정보 수정
    @PatchMapping("/v1/user/info")
    @Operation(summary = "회원 정보 수정",
        description = "등록 되어있는 회원 정보를 수정합니다.")
    public ResponseEntity<Object> userInfoModify(@RequestBody UserModifyDto userModifyDto) {
        Long socialId = 1L;

        userService.userInfoModify(userModifyDto, socialId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("v1/user/logout")
    @Operation(summary = "카카오 로그아웃",
        description = "토큰을 만료 시켜서 로그아웃 시킵니다.")
    public ResponseEntity<Object> userLogout() {
        Long socialId = 1L;

        String nickname = userService.userLogout(socialId);
        return new ResponseEntity<>(new MessageResponse(nickname + "로그아웃 성공"), HttpStatus.OK);
    }

    @PostMapping("v1/user")
    @Operation(summary = "카카오 회원 탈퇴",
        description = "서비스와 연결을 끊고 db에서 삭제합니다.")
    public ResponseEntity<Object> userDelete() {
        Long socialId = 1L;

        String nickname = userService.userDelete(socialId);
        return new ResponseEntity<>(new MessageResponse(nickname + "회원탈퇴"), HttpStatus.OK);
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
