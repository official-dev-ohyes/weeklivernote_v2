package com.ohyes.soolsool.user.dto;

import com.ohyes.soolsool.user.dao.UserChartDataInterface;
import java.time.LocalDate;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserChartDto {

    private LocalDate drinkDate;
    private int drinkAmount;
    private int drinkUnit;

    public static UserChartDto toDto(UserChartDataInterface userChartDataInterface) {
//        boolean isLiked = stock.getIsLiked() == 1;
        return UserChartDto.builder()
            .drinkDate(userChartDataInterface.getDrinkDate())
            .drinkAmount(userChartDataInterface.getDrinkAmount())
            .drinkUnit(userChartDataInterface.getDrinkUnit())
            .build();
    }
}
