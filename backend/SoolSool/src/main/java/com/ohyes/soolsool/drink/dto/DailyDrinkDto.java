package com.ohyes.soolsool.drink.dto;

import java.time.LocalDate;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DailyDrinkDto {

    private LocalDate date;
    private List<DrinkCount> drinks;
    private int totalDrink;
    private float topConc;

    @Builder
    private DailyDrinkDto(LocalDate date, List<DrinkCount> drinks, int totalDrink, float topConc) {
        this.date = date;
        this.drinks = drinks;
        this.totalDrink = totalDrink;
        this.topConc = topConc;
    }
}
