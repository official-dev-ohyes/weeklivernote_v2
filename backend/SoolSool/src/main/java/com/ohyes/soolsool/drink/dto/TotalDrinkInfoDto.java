package com.ohyes.soolsool.drink.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TotalDrinkInfoDto {

    // 음주 데이터
    private int drinkTotal;
    private float alcoholAmount;
    private LocalDateTime drinkStartTime;
    private List<DrinkInfo> drinks;

    // 공식 계산에 필요한 데이터
    private int height;
    private int weight;
    private String gender;

    @Builder
    private TotalDrinkInfoDto(int drinkTotal, float alcoholAmount, LocalDateTime drinkStartTime,
        List<DrinkInfo> drinks, int height, int weight, String gender) {
        this.drinkTotal = drinkTotal;
        this.alcoholAmount = alcoholAmount;
        this.drinkStartTime = drinkStartTime;
        this.drinks = drinks;
        this.height = height;
        this.weight = weight;
        this.gender = gender;
    }
}
