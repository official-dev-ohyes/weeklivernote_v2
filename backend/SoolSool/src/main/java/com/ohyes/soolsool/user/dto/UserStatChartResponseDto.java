package com.ohyes.soolsool.user.dto;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserStatChartResponseDto {

    private WeeklyCharDto weekly;
    private List<YearlyChartDataDto> yearly;
}
