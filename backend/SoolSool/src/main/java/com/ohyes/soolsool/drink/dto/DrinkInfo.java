package com.ohyes.soolsool.drink.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DrinkInfo {

    @Schema(example = "소주")
    private String category;

    @Schema(example = "잔")
    private String drinkUnit;

    @Schema(type = "number", format = "float", example = "1")
    private float drinkAmount;

    @Builder
    private DrinkInfo(String category, String drinkUnit, float drinkAmount) {
        this.category = category;
        this.drinkUnit = drinkUnit;
        this.drinkAmount = drinkAmount;
    }
}
