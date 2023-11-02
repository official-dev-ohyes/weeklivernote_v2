package com.ohyes.soolsool.user.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class YearlyChartDataDto {
    private double value;
    private String label;
    @JsonIgnore
    private int month;

    public YearlyChartDataDto(int month, double totalDrinkAmount) {
        this.value = totalDrinkAmount;
        this.label = month + "월";
        this.month = month;
    }
}