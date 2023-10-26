package com.ohyes.soolsool.drink.dto;

import java.time.LocalDate;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DrinkRequestDto {

    // 음주 관련 부분
    private List<DrinkInfo> drinks;

    // 일기 관련 부분
    private LocalDate drinkDate;
    private String memo;
    private String imgUrl;
    private String hangover;
    private float alcoholConc;

    @Builder
    private DrinkRequestDto(List<DrinkInfo> drinks, LocalDate drinkDate, String memo, String imgUrl, String hangover, float alcoholConc) {
        this.drinks = drinks;
        this.drinkDate = drinkDate;
        this.memo = memo;
        this.imgUrl = imgUrl;
        this.hangover = hangover;
        this.alcoholConc = alcoholConc;
    }
}

