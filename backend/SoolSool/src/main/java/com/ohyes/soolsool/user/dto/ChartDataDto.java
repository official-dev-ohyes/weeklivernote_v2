package com.ohyes.soolsool.user.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.Locale;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChartDataDto {

    private double value;
    private String label;
    @JsonIgnore
    private LocalDate date;

    public ChartDataDto(LocalDate date, double value) {
        this.value = value;
        this.label = date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.KOREA);
        this.date = date;
    }
}
