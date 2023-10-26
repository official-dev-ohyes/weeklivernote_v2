package com.ohyes.soolsool.drink.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DrinkInfo {

    private String category;
    private String drinkUnit;
    private byte drinkAmount;

    @Builder
    private DrinkInfo(String category, String drinkUnit, byte drinkAmount) {
        this.category = category;
        this.drinkUnit = drinkUnit;
        this.drinkAmount = drinkAmount;
    }
}
