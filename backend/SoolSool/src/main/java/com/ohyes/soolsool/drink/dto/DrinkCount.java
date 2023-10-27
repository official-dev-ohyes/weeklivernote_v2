package com.ohyes.soolsool.drink.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DrinkCount {

    private String drink;
    private int count;

    @Builder
    private DrinkCount(String drink, int count) {
        this.drink = drink;
        this.count = count;
    }
}
