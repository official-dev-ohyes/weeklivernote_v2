package com.ohyes.soolsool.user.application;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohyes.soolsool.drink.domain.Category;
import com.ohyes.soolsool.drink.domain.Drink;
import com.ohyes.soolsool.user.dao.UserRepository;
import com.ohyes.soolsool.user.domain.User;
import com.ohyes.soolsool.user.dto.KakaoProfileDto;
import com.ohyes.soolsool.user.dto.UserResponseDto;
import com.ohyes.soolsool.util.jwt.JwtProvider;
import com.ohyes.soolsool.util.jwt.TokenDto;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
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


    public Map<String, Object> kakaoLogin(String code) throws JsonProcessingException {
        KakaoProfileDto newUser = getKakaoUser(getAccessToken(code));

        User user = userRepository.findBySocialId(newUser.getSocialId()).orElse(null);

        if (user == null) {
            user = User.builder()
                .socialId(newUser.getSocialId())
                .nickname(newUser.getNickname())
                .profileImg(newUser.getProfileImg())
                .address("ADDRESS")
                .gender("GENDER")
                .height(1)
                .weight(1)
                .alcoholLimit(1)
                .refreshToken("REFRESH_TOKEN")
                .maxNonalcoholPeriod(1).build();

            userRepository.save(user);
            userInfoAdd(userReponseDto, newUser.getSocialId());
        }

        TokenDto tokenDto =  jwtProvider.createToken(newUser.getSocialId());

        updateRefreshToken(tokenDto, newUser.getSocialId());

        Map<String, Object> data = new HashMap<>();
        data.put("userName", user.getNickname());
        data.put("tokenInfo", tokenDto);
        data.put("alcoholLimit", user.getAlcoholLimit());

        return data;

    }

    // Access Token 받아오기
    public String getAccessToken(String code) throws JsonProcessingException {
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

        String responseBody = accessTokenResponse.getBody();
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(responseBody);
        return jsonNode.get("access_token").asText();
    }


    public KakaoProfileDto getKakaoUser(String token) throws JsonProcessingException {
        RestTemplate rt = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + token);
        headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

        HttpEntity<MultiValueMap<String, String>> kakaoProfileRequest =
            new HttpEntity<>(headers);

        ResponseEntity<String> kakaoProfileResponse = rt.exchange(
            "https://kapi.kakao.com/v2/user/me",
            HttpMethod.POST,
            kakaoProfileRequest,
            String.class
        );

        String responseBody = kakaoProfileResponse.getBody();
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(responseBody);

        Long socialId = jsonNode.get("id").asLong();
        String nickname = jsonNode.get("properties")
            .get("nickname").asText();
        String profileImg = jsonNode.get("kakao_account").get("profile")
            .get("profile_image_url").asText();

        return new KakaoProfileDto(socialId, nickname, profileImg);

    }

    private void updateRefreshToken(TokenDto tokenDto, Long socialId) {
        Optional<User> userOptional = userRepository.findBySocialId(socialId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.updateRefreshToken(tokenDto.getRefreshToken());
            userRepository.save(user);
        } else {
            throw new RuntimeException("일치하는 회원이 없습니다.");
        }
    }

    public  Map<String, Object> userInfoAdd(UserResponseDto userResponseDto, Long socialId) {
        User user = userRepository.findBySocialId(socialId).orElse(null);
        List<Drink> drinks = new ArrayList<>();

        AtomicInteger alcoholLimit = new AtomicInteger();

        drinks.forEach(e -> {
            int amount;
            if (e.getDrinkUnit().equals("잔")) {
                amount = e.getCategory().getGlass() * e.getDrinkAmount();
            } else {
                amount = e.getCategory().getBottle() * e.getDrinkAmount();
            }
            alcoholLimit.addAndGet((int) (amount * e.getCategory().getVolume() * 0.7984 / 100));



        if (user != null) {
            user.setSocialId(socialId); // Social ID는 업데이트하지 않음
            user.setCategory((Category) userResponseDto.getCategory());
            user.setNickname(userResponseDto.getNickname());
            user.setProfileImg(userResponseDto.getProfileImg());
            user.setAddress(userResponseDto.getAddress());
            user.setGender(userResponseDto.getGender());
            user.setHeight(userResponseDto.getHeight());
            user.setWeight(userResponseDto.getWeight());
            user.setAlcoholLimit(alcoholLimit.get());
            user.setRefreshToken(userResponseDto.getRefreshToken());
            user.setMaxNonalcoholPeriod(userResponseDto.getMaxNonalcoholPeriod());

            userRepository.save(user);
        }

        TokenDto tokenDto = TokenDto.builder()
            .accessToken()
            .refreshToken()
            .accessTokenExpiresIn() // 예: 1 시간
            .build();

        Map<String, Object> data = new HashMap<>();
        data.put("userName", user.getNickname());
        data.put("tokenInfo", tokenDto);
        data.put("alcoholLimit", user.getAlcoholLimit());
        return data;

    }

}
