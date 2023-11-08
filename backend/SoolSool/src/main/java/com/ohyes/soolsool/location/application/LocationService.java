package com.ohyes.soolsool.location.application;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohyes.soolsool.location.dto.LocationRequestDto;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

@Service
@RequiredArgsConstructor
@Slf4j
public class LocationService {

    @Value("${odsay.api-key}")
    private String apiKey;

    public Map<String, Object> lastChanceGet(LocationRequestDto locationRequestDto) throws IOException {
        // 출발지부터 도착지까지 ODSAY 대중교통 길찾기 API 호출
        Map<String, Object> bestRoute = findRoute(locationRequestDto);
        System.out.println(bestRoute.toString());

        // 시간 계산

        return bestRoute;
    }

    public Map<String, Object> findRoute(LocationRequestDto locationRequestDto) throws IOException {
        String nowLat = String.valueOf(locationRequestDto.getNowLat());
        String nowLong = String.valueOf(locationRequestDto.getNowLong());
        String homeLat = String.valueOf(locationRequestDto.getHomeLat());
        String homeLong = String.valueOf(locationRequestDto.getHomeLong());

        String urlInfo = "https://api.odsay.com/v1/api/searchPubTransPathT?SX=" + nowLong
            + "&SY=" + nowLat + "&EX=" + homeLong + "&EY=" + homeLat + "&apiKey="
            + URLEncoder.encode(apiKey, "UTF-8");

        // http 연결
        URL url = new URL(urlInfo);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Content-type", "application/json");

        BufferedReader bufferedReader = new BufferedReader(
            new InputStreamReader(conn.getInputStream()));
        StringBuilder sb = new StringBuilder();

        String line;
        while ((line = bufferedReader.readLine()) != null) {
            sb.append(line);
        }
        bufferedReader.close();
        conn.disconnect();

        String jsonData = sb.toString();

        // JSON 데이터를 Map으로 파싱
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> resultMap = objectMapper.readValue(jsonData, Map.class);

        // "result" 객체 가져오기
//        Map<String, Object> result = (Map<String, Object>) resultMap.get("result");
//
//        // "path" 키의 값 (JSON 배열) 가져오기
//        List<Map<String, Object>> pathList = (List<Map<String, Object>>) result.get("path");
//
//        // "path" 배열에서 첫 번째 요소 가져오기 (인덱스 0)
//        Map<String, Object> firstPath = pathList.get(0);

        return resultMap;
    }

}
