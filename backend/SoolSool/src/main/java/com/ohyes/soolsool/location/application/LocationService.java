package com.ohyes.soolsool.location.application;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohyes.soolsool.location.dto.LocationRequestDto;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
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

    public void calculateTime(JsonNode route) throws Exception {
        // 모든 subPath에 대해 가장 일찍 끊기는 막차 계산
        Map<String, List<Object>> pathTimes = new HashMap<>();
        JsonNode subPaths = route.get("subPath");

        for (int i = 0; i < subPaths.size(); i++) {
            int trafficType = subPaths.get(i).get("trafficType").asInt();
            List<Object> pathTime = new ArrayList<>();
            pathTime.add(subPaths.get(i).get("sectionTime").asInt()); // subPath의 소요 시간 저장

            // subPath의 해당 정류장 막차 시간 계산해서 저장
            if (trafficType == 1) { // 지하철
                String stationID = subPaths.get(i).get("startID").asText();
                String wayCode = subPaths.get(i).get("wayCode").asText();
                JsonNode subwayDetail = findSubwayDetail(stationID, wayCode);

                // 요일별, 상하행별 검색해야 하는 키 설정
                String wayCodeKey = "0";
                if (wayCode.equals("1")) {
                    wayCodeKey = "up";
                } else {
                    wayCodeKey = "down";
                }

                String currentDayOfWeek = LocalDate.now().getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.getDefault());
                String dayKey = "0";
                if (currentDayOfWeek.equals("토")) {
                    dayKey = "SatList";
                } else if (currentDayOfWeek.equals("일")) {
                    dayKey = "SunList";
                } else {
                    dayKey = "OrdList";
                }

                // 키 마지막값 파싱
                JsonNode timeInfo = subwayDetail.get("result").get(dayKey).get(wayCodeKey).get("time");
                JsonNode lastTimeInfo = timeInfo.get(timeInfo.size() - 1);
                String lastTimeHour = lastTimeInfo.get("Idx").asText();
                String lastTimeMinuteList = lastTimeInfo.get("list").asText();

                // 문자열을 공백으로 나누고 마지막 문자열 선택
                String[] tokens = lastTimeMinuteList.split("\\s+");
                String lastTimeMinute = tokens[tokens.length - 1].substring(0, 2);

                pathTime.add(lastTimeHour + ":"+ lastTimeMinute);
            } else if (trafficType == 2) { // 버스
                String busID = subPaths.get(i).get("lane").get(0).get("busID").asText();
                int stationID = subPaths.get(i).get("startID").asInt();
                JsonNode busDetail = findBusDetail(busID);

                String busLastTime = busDetail.get("result").get("busLastTime").asText();
                JsonNode stations = busDetail.get("result").get("station");
                int stationIdx = -1;

                // 해당 정류장이 몇번째인지 검색
                for (int j = 0; j < stations.size(); j++) {
                    if (stations.get(j).get("stationID").asInt() == stationID) {
                        stationIdx = j;
                        break;
                    }
                }

                // 시간 형식 지정 후 문자열을 Date 객체로 파싱
                SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
                Date time = sdf.parse(busLastTime);

                // 시간에 보정된 정수(분)을 더하고 결과를 문자열로 형식화
                time.setTime(time.getTime() + ((long) (stationIdx + (stationIdx / 5)) * 60 * 1000));
                String resultTime = sdf.format(time);
                pathTime.add(resultTime);
            } else if (trafficType == 3) { // 도보
                pathTime.add("26:00");
            }
            pathTimes.put(String.valueOf(i), pathTime);
        }

        // pathTimes에 저장된 시간값들로 출발 시간 계산
        log.error("경로 소요 시간 및 막차 시간: " + pathTimes);

    }

    public JsonNode findBusDetail(String busID) throws Exception {
        String urlInfo =
            "https://api.odsay.com/v1/api/busLaneDetail?lang=0&busID=" + busID + "&apiKey="
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
        JsonNode busResult = objectMapper.readTree(jsonData);

        return busResult;
    }

    public JsonNode findSubwayDetail(String stationID, String wayCode) throws Exception {
        String urlInfo =
            "https://api.odsay.com/v1/api/subwayTimeTable?lang=0&stationID=" + stationID
                + "&wayCode=" + wayCode + "&apiKey="
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
        JsonNode subwayResult = objectMapper.readTree(jsonData);

        return subwayResult;
    }
}
