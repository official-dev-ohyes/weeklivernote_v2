package com.ohyes.soolsool.drink.dto;

import java.time.LocalDate;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DailyMainDrink {

    private LocalDate date;
    private String mainDrink;

    @Builder
    private DailyMainDrink(LocalDate date, String mainDrink) {
        this.date = date;
        this.mainDrink = mainDrink;
    }
}
