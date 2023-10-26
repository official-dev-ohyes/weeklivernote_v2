package com.ohyes.soolsool.drink.api;

import com.ohyes.soolsool.drink.application.DrinkGetService;
import com.ohyes.soolsool.drink.application.DrinkService;
import com.ohyes.soolsool.drink.dto.DrinkRequestDto;
import com.ohyes.soolsool.drink.dto.TotalDrinkInfoDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Drink", description = "음주 관련 API document")
public class DrinkController {

    private final DrinkService drinkService;
    private final DrinkGetService drinkGetService;

    @PostMapping("/v1/drink")
    @Operation(summary = "음주 기록 추가", description = "음주 기록, 메모, 숙취 등을 저장합니다.")
    public ResponseEntity<Object> drinkAdd(@RequestBody DrinkRequestDto drinkRequestDto) {
        // 토큰 로직 추가 필요
        Long socialId = 1L;

        drinkService.drinkAdd(drinkRequestDto, socialId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping("/v1/drink")
    @Operation(summary = "음주 기록 수정", description = "음주 기록, 메모, 숙취 등을 수정합니다.")
    public ResponseEntity<Object> drinkModify(@RequestBody DrinkRequestDto drinkRequestDto) {
        // 토큰 로직 추가 필요
        Long socialId = 1L;

        drinkService.drinkModify(drinkRequestDto, socialId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/v1/drink-one")
    @Operation(summary = "음주 기록 여러개 삭제", description = "음주 기록을 삭제하고, 남은 음주 기록이 없을 시 일기도 삭제합니다.")
    public ResponseEntity<Object> drinkDelete(@RequestBody DrinkRequestDto drinkRequestDto) {
        // 토큰 로직 추가 필요
        Long socialId = 1L;

        drinkService.drinkDelete(drinkRequestDto, socialId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/v1/drink/{drinkDate}")
    @Operation(summary = "해당 날짜의 음주 총계 조회",
        description = "총 음주량, 총 알코올양, 음주 시작 시간 및 계산에 필요한 유저 데이터를 반환합니다.")
    public ResponseEntity<Object> totalDrinkInfoGet(@PathVariable LocalDate drinkDate) {
        // 토큰 로직 추가 필요
        Long socialId = 1L;

        TotalDrinkInfoDto totalDrinkInfoDto = drinkGetService.totalDrinkInfoGet(drinkDate, socialId);
        return new ResponseEntity<>(totalDrinkInfoDto, HttpStatus.OK);
    }

    @GetMapping("/v1/drink/monthly")
    public void monthlyDrinkGet() {

    }

    @GetMapping("/v1/drink/daily")
    public void dailyDrinkGet() {

    }

    /* 일단 보류
    @GetMapping("/v1/drink/daily-detail/{drinkDate}")
    public ResponseEntity<Object> dailyDetailDrinkGet(@PathVariable LocalDate drinkDate) {
        // 토큰 로직 추가 필요
        Long socialId = 1L;

        drinkGetService.dailyDetailDrinkGet(drinkDate, socialId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    */

    @DeleteMapping("/v1/drink/daily/{drinkDate}")
    @Operation(summary = "음주 기록 및 일기 전체 삭제", description = "날짜만 보내면 해당 날짜의 모든 기록을 삭제합니다.")
    public ResponseEntity<Object> drinkEventDelete(@PathVariable LocalDate drinkDate) {
        // 토큰 로직 추가 필요
        Long socialId = 1L;

        drinkService.drinkEventDelete(drinkDate, socialId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
