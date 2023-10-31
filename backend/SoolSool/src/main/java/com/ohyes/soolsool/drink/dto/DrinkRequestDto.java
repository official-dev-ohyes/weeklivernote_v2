package com.ohyes.soolsool.drink.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.time.LocalTime;
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

    @Schema(example = "18:00")
    private LocalTime startTime;
    private String memo;
    private String hangover;
    private float alcoholConc;

    @Builder
    private DrinkRequestDto(List<DrinkInfo> drinks, LocalDate drinkDate, LocalTime startTime, String memo, String hangover, float alcoholConc) {
        this.drinks = drinks;
        this.drinkDate = drinkDate;
        this.startTime = startTime;
        this.memo = memo;
        this.hangover = hangover;
        this.alcoholConc = alcoholConc;
    }
}

