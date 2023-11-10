package com.ohyes.soolsool.gps.application;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohyes.soolsool.location.dao.LocationRepository;
import com.ohyes.soolsool.location.domain.Location;
import java.util.Collections;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
public class GpsService {

    @Value("${kakao.client-id}")
    private String API_KEY;
    private static final String API_URL = "https://dapi.kakao.com/v2/local/search/address.json?query=";
    private final LocationRepository locationRepository;

    // 주소에서 위도/경도 정보 조회 후 저장
    public void getDestinationGpsInfo(Location location, String address) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.set("Authorization", "KakaoAK " + API_KEY);

        HttpEntity<String> entity = new HttpEntity<>("body", headers);

        ResponseEntity<String> response = restTemplate.exchange(API_URL + address, HttpMethod.GET,
            entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(response.getBody());
                JsonNode documents = root.path("documents");

                double latitude = documents.get(0).path("road_address").path("y").asDouble();
                double longitude = documents.get(0).path("road_address").path("x").asDouble();

                System.out.println("위도 : " + latitude);
                System.out.println("경도 : " + longitude);

                location.setHomeLat(latitude);
                location.setHomeLong(longitude);

                locationRepository.save(location);
                log.info("[Location] 사용자 주소지의 위도/경도가 저장되었습니다.");

            } catch (Exception e) {
                log.error("Error: " + e.getMessage());
            }
        } else {
            log.error("Error: " + response.getStatusCode());
        }
    }
}
