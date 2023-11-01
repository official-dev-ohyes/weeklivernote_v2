package com.ohyes.soolsool.drink.dao;

import com.ohyes.soolsool.drink.domain.Drink;
import com.ohyes.soolsool.user.dao.UserChartDataInterface;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DrinkRepository extends JpaRepository<Drink, Integer> {

    @Query("SELECT sum(c.glass * d.drinkAmount) FROM Drink d " +
            "JOIN d.diary di " +
            "JOIN d.category c " +
            "WHERE di.user.socialId = :socialId " +
            "AND d.drinkUnit = '잔' " +
            "AND YEAR(di.drinkDate) = :year")
    long getTotalDrinkAmountInGlass(@Param("socialId") Long socialId, @Param("year") int year);

    @Query("SELECT sum(c.bottle * d.drinkAmount) FROM Drink d " +
            "JOIN d.diary di " +
            "JOIN d.category c " +
            "WHERE di.user.socialId = :socialId " +
            "AND d.drinkUnit = '병' " +
            "AND YEAR(di.drinkDate) = :year")
    long getTotalDrinkAmountInBottle(@Param("socialId") Long socialId, @Param("year") int year);

    @Query("SELECT di.drinkDate, d.drinkAmount, c.glass FROM Drink d " +
        "JOIN d.diary di " +
        "JOIN d.category c " +
        "WHERE di.user.socialId = :socialId " +
        "AND d.drinkUnit = '잔' " +
        "AND di.drinkDate BETWEEN :startDate AND :now")
    List<UserChartDataInterface> getWeeklyDrinkAmountInGlass(@Param("socialId") Long socialId,
        @Param("startDate") LocalDate startDate, @Param("now") LocalDate now);
}
