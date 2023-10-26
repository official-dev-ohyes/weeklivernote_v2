package com.ohyes.soolsool.drink.dao;

import com.ohyes.soolsool.drink.domain.Diary;
import com.ohyes.soolsool.user.domain.User;
import java.time.LocalDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DiaryRepository extends JpaRepository<Diary, Integer> {

    boolean existsByDrinkDateAndUser(LocalDate drinkDate, User user);

    @Query("SELECT d.diaryPk FROM Diary d WHERE d.drinkDate = :drinkDate AND d.user = :user")
    Integer findDiaryPkByDrinkDateAndUser(@Param("drinkDate") LocalDate drinkDate, @Param("user") User user);

    Diary findByDrinkDateAndUser(LocalDate drinkDate, User user);
    Diary findByDiaryPk(Integer diaryPk);
}
