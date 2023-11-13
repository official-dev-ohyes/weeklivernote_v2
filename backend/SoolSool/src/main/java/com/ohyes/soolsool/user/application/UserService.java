package com.ohyes.soolsool.user.application;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohyes.soolsool.drink.dao.CategoryRepository;
import com.ohyes.soolsool.drink.domain.Category;
import com.ohyes.soolsool.drink.dto.DrinkInfo;
import com.ohyes.soolsool.gps.application.GpsService;
import com.ohyes.soolsool.gps.dto.GpsInfo;
import com.ohyes.soolsool.location.dao.LocationRepository;
import com.ohyes.soolsool.location.domain.Location;
import com.ohyes.soolsool.user.dao.UserRepository;
import com.ohyes.soolsool.user.domain.User;
import com.ohyes.soolsool.user.dto.KakaoProfileDto;
import com.ohyes.soolsool.user.dto.UserModifyDto;
import com.ohyes.soolsool.user.dto.UserRequestDto;
import com.ohyes.soolsool.user.dto.UserResponseDto;
import com.ohyes.soolsool.util.UserDetailsImpl;
import com.ohyes.soolsool.util.UserUtils;
import com.ohyes.soolsool.util.jwt.JwtProvider;
import com.ohyes.soolsool.util.jwt.TokenDto;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
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

    @Value("${kakao.admin-key}")
    private String admin_key;

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final LocationRepository locationRepository;
    private final JwtProvider jwtProvider;
    private final GpsService gpsService;

    // 카카오 로그인
    public KakaoProfileDto kakaoLogin(String code) throws JsonProcessingException {
        KakaoProfileDto newUser = getKakaoUser(getAccessToken(code));

        return newUser;

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

    // 카카오 유저 정보 저장
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

        String socialId = String.valueOf(jsonNode.get("id"));
        String nickname = jsonNode.get("properties")
            .get("nickname").asText();
        String tempImg = jsonNode.get("kakao_account").get("profile")
            .get("profile_image_url").asText();
        String profileImg = "https://" + tempImg.substring(7);

        return new KakaoProfileDto(socialId, nickname, profileImg);

    }

    // 리프래쉬토큰 업데이트
    private void updateRefreshToken(TokenDto tokenDto, String socialId) {
        Optional<User> userOptional = userRepository.findBySocialId(socialId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.updateRefreshToken(tokenDto.getRefreshToken());
            userRepository.save(user);
        } else {
            throw new RuntimeException("일치하는 회원이 없습니다.");
        }
    }

    // 회원가입
    public Map<String, Object> registerKakaoUser(KakaoProfileDto kakaoProfileDto) {
        User user = userRepository.findBySocialId(kakaoProfileDto.getSocialId()).orElse(null);

        if (user == null) {
            user = User.builder()
                .socialId(kakaoProfileDto.getSocialId())
                .nickname(kakaoProfileDto.getNickname())
                .profileImg(kakaoProfileDto.getProfileImg())
                .address("address")
                .gender("여자")
                .height(161)
                .weight(50)
                .alcoholLimit(40)
                .refreshToken("REFRESH_TOKEN")
                .maxNonalcoholPeriod(0)
                .startNonalcoholDate(LocalDate.now())
                .build();

            Location location = new Location();
            locationRepository.save(location);

            user.setLocation(location);
            userRepository.save(user);

            Map<String, Object> data = new HashMap<>();
            data.put("socialId", kakaoProfileDto.getSocialId());
            data.put("message", "추가 정보 등록이 필요한 회원입니다.");
            return data;
        }

        if (user.getRefreshToken().equals("REFRESH_TOKEN")) {
            log.info(user.getRefreshToken());
            Map<String, Object> data = new HashMap<>();
            data.put("socialId", kakaoProfileDto.getSocialId());
            data.put("message", "추가 정보 등록이 필요한 회원입니다.");
            return data;
        }

        TokenDto tokenDto = jwtProvider.createToken(user);
        DrinkInfo drinkInfo = DrinkInfo.builder()
            .category(user.getDrinkCategory())
            .drinkUnit(user.getDrinkUnit())
            .drinkAmount(user.getDrinkAmount())
            .build();

        updateRefreshToken(tokenDto, kakaoProfileDto.getSocialId());

        GpsInfo gpsInfo = GpsInfo.builder()
            .latitude(user.getLocation().getHomeLat())
            .longitude(user.getLocation().getHomeLong())
            .build();

        Map<String, Object> data = new HashMap<>();
        data.put("userName", user.getNickname());
        data.put("tokenInfo", tokenDto);
        data.put("alcoholLimit", user.getAlcoholLimit());
        data.put("drinkInfo", drinkInfo);
        data.put("gpsInfo", gpsInfo);

        return data;
    }

    // 회원 추가 정보 등록
    public Map<String, Object> userInfoAdd(UserRequestDto userRequestDto) {

        String socialId = userRequestDto.getSocialId();

        User user = userRepository.findBySocialId(socialId).orElse(null);
        DrinkInfo drinkInfo = userRequestDto.getDrinkInfo();
        Category category = categoryRepository.findByCategoryName(drinkInfo.getCategory())
            .orElseThrow(() -> new NullPointerException("주종이 바르지 않습니다."));

        float alcoholLimit = 0;

        int amount;

        if (drinkInfo.getCategory().equals("소주")) {
            if (drinkInfo.getDrinkUnit().equals("잔")) {
                amount = (int) (category.getGlass() * drinkInfo.getDrinkAmount());
            } else {
                amount = (int) (category.getBottle() * drinkInfo.getDrinkAmount());
            }
        } else {
            if (drinkInfo.getCategory().equals("잔")) {
                amount = (int) (category.getGlass() * drinkInfo.getDrinkAmount());
            } else {
                amount = (int) (category.getBottle() * drinkInfo.getDrinkAmount());
            }
        }
        alcoholLimit += ((float) (amount * category.getVolume() * 0.7984 / 100));

        user.setSocialId(socialId);
        user.setAddress(userRequestDto.getAddress());
        user.setGender(userRequestDto.getGender());
        user.setHeight(userRequestDto.getHeight());
        user.setWeight(userRequestDto.getWeight());
        user.setAlcoholLimit(alcoholLimit);
        user.setRefreshToken(userRequestDto.getRefreshToken());
        user.setDrinkCategory(drinkInfo.getCategory());
        user.setDrinkUnit(drinkInfo.getDrinkUnit());
        user.setDrinkAmount(drinkInfo.getDrinkAmount());

        userRepository.save(user);

        GpsInfo gpsInfo = GpsInfo.builder()
            .latitude(0)
            .longitude(0)
            .build();
        // 주소 입력 했을 경우 위도/경도 데이터 저장
        if (!userRequestDto.getAddress().equals("주소지 미입력")) {
            Location location = user.getLocation();
            gpsInfo = gpsService.getDestinationGpsInfo(location, userRequestDto.getAddress());
        }

        TokenDto tokenDto = jwtProvider.createToken(user);

        updateRefreshToken(tokenDto, socialId);

        Map<String, Object> data = new HashMap<>();
        data.put("userName", user.getNickname());
        data.put("tokenInfo", tokenDto);
        data.put("alcoholLimit", user.getAlcoholLimit());
        data.put("drinkInfo", drinkInfo);
        data.put("gpsInfo", gpsInfo);

        return data;
    }

    // 회원 추가 정보 조회
    public UserResponseDto userInfoGet(UserDetailsImpl userDetails) {
        User user = UserUtils.getUserFromToken(userDetails);

        String nickname = user.getNickname();
        String profileImg = user.getProfileImg();
        if (user.getCustomProfileImg() != null) {
            profileImg = user.getCustomProfileImg();
        }
        String address = user.getAddress();
        String gender = user.getGender();
        int height = user.getHeight();
        int weight = user.getWeight();
        float alcoholLimit = user.getAlcoholLimit();

        DrinkInfo drinkInfo = DrinkInfo.builder()
            .category(user.getDrinkCategory())
            .drinkUnit(user.getDrinkUnit())
            .drinkAmount(user.getDrinkAmount())
            .build();

        GpsInfo gpsInfo = GpsInfo.builder()
            .latitude(user.getLocation().getHomeLat())
            .longitude(user.getLocation().getHomeLong())
            .build();

        return UserResponseDto.builder()
            .nickname(nickname)
            .profileImg(profileImg)
            .address(address)
            .gender(gender)
            .height(height)
            .weight(weight)
            .alcoholLimit(alcoholLimit)
            .drinkInfo(drinkInfo)
            .gpsInfo(gpsInfo)
            .build();
    }

    // 회원 추가 정보 수정
    public GpsInfo userInfoModify(UserModifyDto userModifyDto, UserDetailsImpl userDetails) {
        User user = UserUtils.getUserFromToken(userDetails);
        DrinkInfo drinkInfo = userModifyDto.getDrinkInfo();
        Category category = categoryRepository.findByCategoryName(drinkInfo.getCategory())
            .orElseThrow(() -> new NullPointerException("주종이 바르지 않습니다."));

        GpsInfo gpsInfo = GpsInfo.builder()
            .latitude(user.getLocation().getHomeLat())
            .longitude(user.getLocation().getHomeLong())
            .build();

        // 기본 정보 수정
        if (userModifyDto.getNickname() != null) {
            user.setNickname(userModifyDto.getNickname());
        }
        if (userModifyDto.getAddress() != null) {
            user.setAddress(userModifyDto.getAddress());

            // 주소 입력 했을 경우 위도/경도 데이터 저장
            if (!userModifyDto.getAddress().equals("주소지 미입력")) {
                Location location = user.getLocation();
                gpsInfo =  gpsService.getDestinationGpsInfo(location, userModifyDto.getAddress());
            }
        }
        if (userModifyDto.getGender() != null) {
            user.setGender(userModifyDto.getGender());
        }
        if (userModifyDto.getHeight() != 0) {
            user.setHeight(userModifyDto.getHeight());
        }
        if (userModifyDto.getWeight() != 0) {
            user.setWeight(userModifyDto.getWeight());
        }

        // 주량 수정
        if (drinkInfo != null) {
            user.setDrinkCategory(drinkInfo.getCategory());
            user.setDrinkUnit(drinkInfo.getDrinkUnit());
            user.setDrinkAmount(drinkInfo.getDrinkAmount());

            float alcoholLimit = 0;

            int amount;

            if (drinkInfo.getCategory().equals("소주")) {
                if (drinkInfo.getDrinkUnit().equals("잔")) {
                    amount = (int) (category.getGlass() * drinkInfo.getDrinkAmount());
                } else {
                    amount = (int) (category.getBottle() * drinkInfo.getDrinkAmount());
                }
            } else {
                if (drinkInfo.getCategory().equals("잔")) {
                    amount = (int) (category.getGlass() * drinkInfo.getDrinkAmount());
                } else {
                    amount = (int) (category.getBottle() * drinkInfo.getDrinkAmount());
                }
            }
            alcoholLimit += ((float) (amount * category.getVolume() * 0.7984 / 100));
            user.setAlcoholLimit(alcoholLimit);
        }

        userRepository.save(user);
        return gpsInfo;
    }

    // 카카오 로그아웃
    public String userLogout(User user) {
        String nickname = user.getNickname();

        try {
            RestTemplate rt = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.add("Authorization", "KakaoAK " + admin_key);

            MultiValueMap<String, Object> params = new LinkedMultiValueMap<>();
            params.add("target_id_type", "user_id");
            params.add("target_id", String.valueOf(user.getSocialId()));

            HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(params, headers);
            ResponseEntity<String> response = rt.exchange(
                "https://kapi.kakao.com/v1/user/logout",
                HttpMethod.POST,
                entity,
                String.class
            );
            return nickname;
        } catch (Exception e) {
            log.info(e.getMessage());
            throw e;
        }
    }

    public String userDelete(UserDetailsImpl userDetails) {
        User user = UserUtils.getUserFromToken(userDetails);
        String nickname = userLogout(user);


        try {
            RestTemplate rt = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.add("Authorization", "KakaoAK " + admin_key);

            MultiValueMap<String, Object> params = new LinkedMultiValueMap<>();
            params.add("target_id_type", "user_id");
            params.add("target_id", String.valueOf(user.getSocialId()));

            HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(params, headers);
            ResponseEntity<String> response = rt.exchange(
                "https://kapi.kakao.com/v1/user/unlink",
                HttpMethod.POST,
                entity,
                String.class
            );

            userRepository.delete(user);
            return nickname;
        } catch (Exception e) {
            log.info(e.getMessage());
            throw e;
        }
    }
}
