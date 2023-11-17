package com.ohyes.soolsool.drink.dao;

import com.ohyes.soolsool.drink.domain.Drink;
import com.ohyes.soolsool.user.dto.ChartAlcDataDto;
import com.ohyes.soolsool.user.dto.ChartDrinkDataDto;
import com.ohyes.soolsool.user.dto.YearlyChartDataDto;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DrinkRepository extends JpaRepository<Drink, Integer> {

    @Query("SELECT COALESCE(sum(c.glass * d.drinkAmount), 0) FROM Drink d " +
            "JOIN d.diary di " +
            "JOIN d.category c " +
            "WHERE di.user.socialId = :socialId " +
            "AND d.drinkUnit = '잔' " +
            "AND YEAR(di.drinkDate) = :year")
    long getTotalDrinkAmountInGlass(@Param("socialId") String socialId, @Param("year") int year);

    @Query("SELECT COALESCE(sum(c.bottle * d.drinkAmount), 0) FROM Drink d " +
            "JOIN d.diary di " +
            "JOIN d.category c " +
            "WHERE di.user.socialId = :socialId " +
            "AND d.drinkUnit = '병' " +
            "AND YEAR(di.drinkDate) = :year")
    long getTotalDrinkAmountInBottle(@Param("socialId") String socialId, @Param("year") int year);

    @Query(
        "SELECT new com.ohyes.soolsool.user.dto.ChartDrinkDataDto(d.diary.drinkDate, "
            + "ROUND(sum(case when d.drinkUnit = '잔' then c.glass * d.drinkAmount "
            + "when d.drinkUnit = '병' then c.bottle * d.drinkAmount else 0 end), 2)) "
            + "as totalDrinkAmount " +
            "FROM Drink d " +
            "JOIN d.diary di " +
            "JOIN d.category c " +
            "WHERE di.user.socialId = :socialId " +
            "AND di.drinkDate between :startDate and :now " +
            "GROUP BY d.diary.drinkDate")
    List<ChartDrinkDataDto> getDrinkData(String socialId, LocalDate startDate, LocalDate now);

    @Query(
        "SELECT new com.ohyes.soolsool.user.dto.ChartAlcDataDto(d.diary.drinkDate, "
            + "ROUND(sum(case when d.drinkUnit = '잔' then (c.glass * d.drinkAmount * c.volume * 0.7984 / 100) "
            + "when d.drinkUnit = '병' then (c.bottle * d.drinkAmount * 0.7984 / 100) else 0 end), 2)) "
            + "as totalDrinkAmount " +
            "FROM Drink d " +
            "JOIN d.diary di " +
            "JOIN d.category c " +
            "WHERE di.user.socialId = :socialId " +
            "AND di.drinkDate between :startDate and :now " +
            "GROUP BY d.diary.drinkDate")
    List<ChartAlcDataDto> getAlcData(String socialId, LocalDate startDate, LocalDate now);

    @Query(
        "SELECT new com.ohyes.soolsool.user.dto.YearlyChartDataDto(MONTH(d.diary.drinkDate), "
            + "sum(case when d.drinkUnit = '잔' then c.glass * d.drinkAmount "
            + "when d.drinkUnit = '병' then c.bottle * d.drinkAmount else 0 end)) "
            + "as totalDrinkAmount " +
            "FROM Drink d " +
            "JOIN d.diary di " +
            "JOIN d.category c " +
            "WHERE di.user.socialId = :socialId " +
            "AND YEAR(d.diary.drinkDate) = :year " +
            "GROUP BY MONTH(d.diary.drinkDate)")
    List<YearlyChartDataDto> getYearlyData(String socialId, @Param("year") int year);
}
