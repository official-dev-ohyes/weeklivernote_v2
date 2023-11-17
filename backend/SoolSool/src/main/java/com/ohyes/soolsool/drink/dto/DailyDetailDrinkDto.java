package com.ohyes.soolsool.drink.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DailyDetailDrinkDto {

    private LocalDate date;
    private LocalDateTime startTime;
    private float detoxTime;
    private List<DrinkPercent> drinks;
    private String memo;
    private String img;
    private String hangover;

    @Builder
    private DailyDetailDrinkDto(LocalDate date, LocalDateTime startTime, float detoxTime,
        List<DrinkPercent> drinks, String memo, String img, String hangover) {
        this.date = date;
        this.startTime = startTime;
        this.detoxTime = detoxTime;
        this.drinks = drinks;
        this.memo = memo;
        this.img = img;
        this.hangover = hangover;
    }
}
