package com.ohyes.soolsool.user.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChartAlcDataDto {

    private double value;
    @JsonIgnore
    private LocalDate date;

    public ChartAlcDataDto(LocalDate date, double value) {
        this.value = value;
        this.date = date;
    }
}
