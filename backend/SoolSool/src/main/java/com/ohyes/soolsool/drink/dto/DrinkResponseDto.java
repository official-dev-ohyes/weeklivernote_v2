package com.ohyes.soolsool.drink.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DrinkResponseDto {

    private int diaryPk;
    // 로그인 구현 후 소셜 아이디 필요
    private String drinkDate;
    private String memo;
    private String imgUrl;
    private String hangover;
    private float alcoholConc;

    @Builder
    private DrinkResponseDto(int diaryPk, String drinkDate, String memo, String imgUrl, String hangover, float alcoholConc) {
        this.diaryPk = diaryPk;
        this.drinkDate = drinkDate;
        this.memo = memo;
        this.imgUrl = imgUrl;
        this.hangover = hangover;
        this.alcoholConc = alcoholConc;
    }
}
