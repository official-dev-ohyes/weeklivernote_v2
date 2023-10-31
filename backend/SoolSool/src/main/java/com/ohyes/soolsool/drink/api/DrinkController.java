package com.ohyes.soolsool.drink.api;

import com.ohyes.soolsool.drink.application.DrinkGetService;
import com.ohyes.soolsool.drink.application.DrinkService;
import com.ohyes.soolsool.drink.application.UploadService;
import com.ohyes.soolsool.drink.dto.DailyDetailDrinkDto;
import com.ohyes.soolsool.drink.dto.DailyDrinkDto;
import com.ohyes.soolsool.drink.dto.DrinkRequestDto;
import com.ohyes.soolsool.drink.dto.MonthlyDrinkInfoDto;
import com.ohyes.soolsool.drink.dto.TotalDrinkInfoDto;
import com.ohyes.soolsool.util.MessageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Drink", description = "음주 관련 API document")
public class DrinkController {

    private final DrinkService drinkService;
    private final DrinkGetService drinkGetService;
    private final UploadService uploadService;

    @PostMapping("/v1/drink")
    @Operation(summary = "음주 기록 추가",
        description = "음주 기록, 메모, 숙취 등을 저장합니다.(startTime 없으면 현재 시간으로 음주 기록 저장)")
    public ResponseEntity<Object> drinkAdd(@RequestBody DrinkRequestDto drinkRequestDto) {
        // 토큰 로직 추가 필요
        try {
            Long socialId = 1L;

            drinkService.drinkAdd(drinkRequestDto, socialId);
            return new ResponseEntity<>(new MessageResponse("음주 기록 저장 성공"), HttpStatus.OK);
        } catch (NullPointerException e){
            return new ResponseEntity<>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(value = "/v1/drink/photo/{drinkDate}", produces = "application/json", consumes = "multipart/form-data")
    @Operation(summary = "해당 날짜의 사진 저장",
        description = "사진 파일을 저장합니다.(빈 값을 보내면 사진 파일을 삭제합니다.)")
    public ResponseEntity<Object> drinkPhotoAdd(@PathVariable LocalDate drinkDate, @RequestPart(value = "file", required = false) MultipartFile multipartFile) throws Exception{
        // 토큰 로직 추가 필요
        try {
            Long socialId = 1L;

            uploadService.drinkPhotoAdd(drinkDate, multipartFile, socialId);
            return new ResponseEntity<>(new MessageResponse("사진 변경사항 저장 성공"), HttpStatus.OK);
        } catch (NullPointerException e) {
            return new ResponseEntity<>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping("/v1/drink")
    @Operation(summary = "음주 기록 수정", description = "음주 기록, 메모, 숙취 등을 수정합니다.")
    public ResponseEntity<Object> drinkModify(@RequestBody DrinkRequestDto drinkRequestDto) {
        // 토큰 로직 추가 필요
        try {
            Long socialId = 1L;

            drinkService.drinkModify(drinkRequestDto, socialId);
            return new ResponseEntity<>(new MessageResponse("음주 기록 수정 성공"), HttpStatus.OK);
        } catch (NullPointerException e){
            return new ResponseEntity<>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/v1/drink-one")
    @Operation(summary = "음주 기록 여러개 삭제", description = "음주 기록을 삭제하고, 남은 음주 기록이 없을 시 일기도 삭제합니다.")
    public ResponseEntity<Object> drinkDelete(@RequestBody DrinkRequestDto drinkRequestDto) {
        // 토큰 로직 추가 필요
        try {
            Long socialId = 1L;

            drinkService.drinkDelete(drinkRequestDto, socialId);
            return new ResponseEntity<>(new MessageResponse("음주 기록 중 특정 주종 삭제 성공"), HttpStatus.OK);
        } catch (NullPointerException | IOException e){
            return new ResponseEntity<>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/v1/drink/{drinkDate}")
    @Operation(summary = "해당 날짜의 음주 총계 조회",
        description = "총 음주량, 총 알코올양, 음주 시작 시간 및 계산에 필요한 유저 데이터를 반환합니다.")
    public ResponseEntity<Object> totalDrinkInfoGet(@PathVariable LocalDate drinkDate) {
        // 토큰 로직 추가 필요
        try {
            Long socialId = 1L;

            TotalDrinkInfoDto totalDrinkInfoDto = drinkGetService.totalDrinkInfoGet(drinkDate,
                socialId);
            return new ResponseEntity<>(totalDrinkInfoDto, HttpStatus.OK);
        } catch (NullPointerException e){
            return new ResponseEntity<>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/v1/drink/monthly/{drinkDate}")
    @Operation(summary = "해당 월의 음주 전체 조회",
        description = "날짜와 대표 주종(가장 많이 마신 주종)의 리스트를 반환합니다.")
    public ResponseEntity<Object> monthlyDrinkGet(@PathVariable LocalDate drinkDate) {
        // 토큰 로직 추가 필요
        try {
            Long socialId = 1L;

            MonthlyDrinkInfoDto monthlyDrinkInfoDto = drinkGetService.monthlyDrinkGet(drinkDate,
                socialId);
            return new ResponseEntity<>(monthlyDrinkInfoDto, HttpStatus.OK);
        } catch (NullPointerException e){
            return new ResponseEntity<>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/v1/drink/daily/{drinkDate}")
    @Operation(summary = "해당 날짜의 음주 요약 조회",
        description = "주종과 음주량을 모아둔 리스트, 총 음주량, 최고 혈중 알코올 농도를 반환합니다.")
    public ResponseEntity<Object> dailyDrinkGet(@PathVariable LocalDate drinkDate) {
        // 토큰 로직 추가 필요
        try {
            Long socialId = 1L;

            DailyDrinkDto dailyDrinkDto = drinkGetService.dailyDrinkGet(drinkDate, socialId);
            return new ResponseEntity<>(dailyDrinkDto, HttpStatus.OK);
        } catch (NullPointerException e){
            return new ResponseEntity<>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/v1/drink/daily-detail/{drinkDate}")
    @Operation(summary = "해당 날짜의 음주 상세 조회",
        description = "날짜, 음주 시작 시간, 해독 시간, 그래프 관련 데이터 및 일기 정보를 반환합니다."
            + "(당일 조회의 경우 detoxTime은 0.0입니다.)")
    public ResponseEntity<Object> dailyDetailDrinkGet(@PathVariable LocalDate drinkDate) {
        // 토큰 로직 추가 필요
        try {
            Long socialId = 1L;

            DailyDetailDrinkDto dailyDetailDrinkDto = drinkGetService.dailyDetailDrinkGet(drinkDate,
                socialId);
            return new ResponseEntity<>(dailyDetailDrinkDto, HttpStatus.OK);
        } catch (NullPointerException e){
            return new ResponseEntity<>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/v1/drink/daily/{drinkDate}")
    @Operation(summary = "음주 기록 및 일기 전체 삭제", description = "날짜만 보내면 해당 날짜의 모든 기록을 삭제합니다.")
    public ResponseEntity<Object> drinkEventDelete(@PathVariable LocalDate drinkDate) {
        // 토큰 로직 추가 필요
        try {
            Long socialId = 1L;

            drinkService.drinkEventDelete(drinkDate, socialId);
            return new ResponseEntity<>(new MessageResponse("음주 기록 전체 삭제 성공"), HttpStatus.OK);
        } catch (NullPointerException | IOException e){
            return new ResponseEntity<>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
}
