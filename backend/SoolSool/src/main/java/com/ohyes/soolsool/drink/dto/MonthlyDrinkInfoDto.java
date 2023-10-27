package com.ohyes.soolsool.drink.dto;

import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MonthlyDrinkInfoDto {

    private List<DailyMainDrink> drinks;

    @Builder
    private  MonthlyDrinkInfoDto(List<DailyMainDrink> drinks) {
        this.drinks = drinks;
    }
}
