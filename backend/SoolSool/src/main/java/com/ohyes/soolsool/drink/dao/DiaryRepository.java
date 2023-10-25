package com.ohyes.soolsool.drink.dao;

import com.ohyes.soolsool.drink.domain.Diary;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DiaryRepository extends JpaRepository<Diary, Integer> {

    boolean existsByDrinkDate(String drinkDate);

    @Query("SELECT d.diaryPk FROM Diary d WHERE d.drinkDate = :drinkDate")
    Integer findDiaryPkByDrinkDate(@Param("drinkDate") String drinkDate);

    Diary findByDrinkDate(String drinkDate);
    Diary findByDiaryPk(Integer diaryPk);
}
