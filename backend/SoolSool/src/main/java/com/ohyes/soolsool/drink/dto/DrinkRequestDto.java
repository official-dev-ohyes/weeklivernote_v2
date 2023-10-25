package com.ohyes.soolsool.drink.dto;

import java.util.HashMap;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DrinkRequestDto {

    // 음주 관련 부분
    private String category;
    private String drinkUnit;
    private byte drinkAmount;
    
    // 일기 관련 부분
    private String drinkDate;
    private String memo;
    private String imgUrl;
    private String hangover;
    private float alcoholConc;

    @Builder
    private DrinkRequestDto(String category, String drinkUnit, byte drinkAmount, String drinkDate, String memo, String imgUrl, String hangover, float alcoholConc) {
        this.category = category;
        this.drinkUnit = drinkUnit;
        this.drinkAmount = drinkAmount;
        this.drinkDate = drinkDate;
        this.memo = memo;
        this.imgUrl = imgUrl;
        this.hangover = hangover;
        this.alcoholConc = alcoholConc;
    }
}
