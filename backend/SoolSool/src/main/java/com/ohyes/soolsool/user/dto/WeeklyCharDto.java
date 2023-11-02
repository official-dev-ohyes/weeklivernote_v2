package com.ohyes.soolsool.user.dto;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WeeklyCharDto {

    private List<ChartDataDto> bar;
    private List<ChartDataDto> line;
}
