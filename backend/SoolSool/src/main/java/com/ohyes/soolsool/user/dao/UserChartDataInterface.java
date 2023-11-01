package com.ohyes.soolsool.user.dao;

import java.time.LocalDate;

public interface UserChartDataInterface {

    LocalDate getDrinkDate();
    int getDrinkAmount();
    int getDrinkUnit();

}
