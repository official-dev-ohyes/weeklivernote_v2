package com.ohyes.soolsool.drink.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DrinkPercent {

    private String category;
    private float alcPercent;
    private float drinkPercent;

    @Builder
    private DrinkPercent(String category, float alcPercent, float drinkPercent) {
        this.category = category;
        this.alcPercent = alcPercent;
        this.drinkPercent = drinkPercent;
    }
}
