package com.ohyes.soolsool.user.application;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohyes.soolsool.user.dao.UserRepository;
import com.ohyes.soolsool.user.domain.User;
import com.ohyes.soolsool.user.dto.UserRequestDto;
import java.util.Date;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@RequiredArgsConstructor
@Slf4j
@Service
public class UserService {

    @Value("${kakao.client-id}")
    private String client_id;

    @Value("${kakao.redirect-uri}")
    private String redirect_uri;

    @Value("${kakao.client-secret}")
    private String client_secret;

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;



    // Access Token 받아오기
    public String getAccessToken(String code) {
        RestTemplate rt = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", client_id);
        params.add("redirect_uri", redirect_uri);
        params.add("code", code);
        params.add("client_secret", client_secret);

        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest =
            new HttpEntity<>(params, headers);

        ResponseEntity<String> accessTokenResponse = rt.exchange(
            "https://kauth.kakao.com/oauth/token",
            HttpMethod.POST,
            kakaoTokenRequest,
            String.class
        );

        ObjectMapper objectMapper = new ObjectMapper();
        User oauthToken = null;
        try {
            oauthToken = objectMapper.readValue(accessTokenResponse.getBody(), User.class);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return oauthToken;
    }

    public String kakaoLogin(String code) throws Exception {
        UserRequestDto newUser = getKakaoUser(getAccessToken(code));
        Optional<User> user = userRepository.findBySocialId(newUser.getSocialId());

        if (user == null) {
            user = User.builder()
                .socialId(newUser.getSocialId())
                .nickname(newUser.getNickname())
                .profileImg(newUser.getProfileImg())
                .address("ADDRESS").build()
                .gender("GENDER").build()
                .height("HEIGHT").build()
                .weight("WEIGHT").build()
                .alcohol_limit("ALCOHOL_LIMIT").build()
                .refresh_token("REFRESH_TOKEN").build()
                .maxNonalcoholPeriod("MAX_NONALCOHOL_PERIOD").build();

            userRepository.save(user);
        }

//        TokenDto tokenDto =  jwtTokenProvider.createToken(user);

    }

    // 사용자 정보 저장
    public User saveUserAndGetToken(String token) {
        User profile = findProfile(token);

        User user = userRepository.findBySocialId(profile.getKakao_account().getId());

        if(user == null) {
            user = User.builder()
                .socialId(profile.getSocialId())
                .profileImg(profile.getKakao_account().getProfile().getProfile_img())
                .nickname(profile.getKakao_account().getProfile().getNickname())
                .address("ADDRESS").build()
                .gender("GENDER").build()
                .height("HEIGHT").build()
                .weight("WEIGHT").build()
                .alcohol_limit("ALCOHOL_LIMIT").build()
                .refresh_token("REFRESH_TOKEN").build()
                .maxNonalcoholPeriod("MAX_NONALCOHOL_PERIOD").build();

            userRepository.save(user);

        }

        return createToken(user);
    }

    public String createToken(User user){
        String jwtToken = JWT.create()
            .withSubject(user.getSocialId())
            .withExpiresAt(new Date(System.currentTimeMillis()+ JwtProperties.EXPIRATION_TIME))

            .withClaim("id", user.getSocialId())
            .withClaim("nickname", user.getNickname())

            .sign(Algorithm.HMAC512(JwtProperties.SECRET));

        return jwtToken;
    }


    public User getKakaoUser(String token) throws JsonProcessingException {
        RestTemplate rt = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer" + token);
        headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

        HttpEntity<MultiValueMap<String, String>> kakaoProfileRequest =
            new HttpEntity<>(headers);

        ResponseEntity<String> kakaoProfileResponse = rt.exchange(
            "https://kapi.kakao.com/v2/user/me",
            HttpMethod.POST,
            kakaoProfileRequest,
            String.class
        );

//        ObjectMapper objectMapper = new ObjectMapper();
//        User kakaoProfile = null;
//        try {
//            kakaoProfile = objectMapper.readValue(kakaoProfileResponse.getBody(), User.class);
//        } catch (JsonProcessingException e) {
//            e.printStackTrace();
//        }

        String responseBody = kakaoProfileResponse.getBody();
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(responseBody);

        Long socialId = jsonNode.get("id").asLong();
        String nickname = jsonNode.get("properties")
            .get("nickname").asText();
        String profileImg = jsonNode.get("properties")
            .get("profile_image").asText();

        return new UserRequestDto(socialId, nickname, profileImg);

//        return kakaoProfile;
    }

}
