package com.ohyes.soolsool.user.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserStatResponseDto {

    private int nowNonAlcPeriod;
    private int maxNonAlcPeriod;
    private long drinkYearAmount;
}