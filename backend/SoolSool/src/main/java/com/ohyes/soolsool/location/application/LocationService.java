package com.ohyes.soolsool.location.application;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohyes.soolsool.location.dto.LocationRequestDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.BufferedReader;
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

    public JsonNode lastChanceGet(LocationRequestDto locationRequestDto) throws Exception {
        // 출발지부터 도착지까지 ODSAY 대중교통 길찾기 API 호출 후 totalTime이 가장 적게 걸리는 경로 가져오기
        JsonNode shortRoute = findRoute(locationRequestDto);

        // 시간 계산
        calculateTime(shortRoute);

        // 계산된 예상 출발 시간 및 막차 경로 반환

        return shortRoute;
    }

    public JsonNode findRoute(LocationRequestDto locationRequestDto) throws Exception {
        // 입력값 URL 세팅
        String nowLat = String.valueOf(locationRequestDto.getNowLat());
        String nowLong = String.valueOf(locationRequestDto.getNowLong());
        String homeLat = String.valueOf(locationRequestDto.getHomeLat());
        String homeLong = String.valueOf(locationRequestDto.getHomeLong());

        String urlInfo = "https://api.odsay.com/v1/api/searchPubTransPathT?SX=" + nowLong
            + "&SY=" + nowLat + "&EX=" + homeLong + "&EY=" + homeLat + "&apiKey="
            + URLEncoder.encode(apiKey, "UTF-8");

        // HTTP 연결
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

        // JSON 데이터를 JsonNode로 파싱
        String jsonData = sb.toString();
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode routeResult = objectMapper.readTree(jsonData);

        // 도시간 이동일 경우 경로 조회 X
        if (routeResult.get("result").get("searchType").asInt() == 1) {
            throw new Exception("대중교통으로 이동할 수 없는 구간입니다.");
        }

        // 여러 경로 중 최단 시간 경로 찾아서 반환
        int shortestRouteIndex = -1;
        int shortestTime = Integer.MAX_VALUE;
        JsonNode routes = routeResult.get("result").get("path");

        for (int i = 0; i < routes.size(); i++) {
            int routeTime = routes.get(i).get("info").get("totalTime").asInt();
            if (routeTime < shortestTime) {
                shortestRouteIndex = i;
                shortestTime = routeTime;
            }
        }

        return routes.get(shortestRouteIndex);
    }

    public void calculateTime(JsonNode shortRoute) {
        // 모든 subPath에 대해 가장 일찍 끊기는 막차 계산


    }
}
