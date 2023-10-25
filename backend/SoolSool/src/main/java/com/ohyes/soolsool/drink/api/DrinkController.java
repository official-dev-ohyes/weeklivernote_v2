package com.ohyes.soolsool.drink.api;

import com.ohyes.soolsool.drink.application.DrinkService;
import com.ohyes.soolsool.drink.dto.DrinkRequestDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class DrinkController {

    private final DrinkService drinkService;

    @PostMapping("/v1/drink")
    public ResponseEntity<Object> drinkAdd(@RequestBody DrinkRequestDto drinkRequestDto) {
        drinkService.drinkAdd(drinkRequestDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping("/v1/drink")
    public ResponseEntity<Object> drinkModify(@RequestBody DrinkRequestDto drinkRequestDto) {
        drinkService.drinkModify(drinkRequestDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/v1/drink-one")
    public ResponseEntity<Object> drinkDelete(@RequestBody DrinkRequestDto drinkRequestDto) {
        drinkService.drinkDelete(drinkRequestDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/v1/drink")
    public void totalDrinkInfoGet() {

    }

    @GetMapping("/v1/drink/monthly")
    public void monthlyDrinkGet() {

    }

    @GetMapping("/v1/drink/daily")
    public void dailyDrinkGet() {

    }

    @GetMapping("/v1/drink/daily-detail")
    public void dailyDetailDrinkGet() {

    }

    @DeleteMapping("/v1/drink/daily")
    public ResponseEntity<Object> drinkEventDelete(@RequestBody DrinkRequestDto drinkRequestDto) {
        drinkService.drinkEventDelete(drinkRequestDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
