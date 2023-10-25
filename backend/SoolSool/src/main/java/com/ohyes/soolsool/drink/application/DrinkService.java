package com.ohyes.soolsool.drink.application;

import com.ohyes.soolsool.drink.dao.CategoryRepository;
import com.ohyes.soolsool.drink.dao.DiaryRepository;
import com.ohyes.soolsool.drink.dao.DrinkRepository;
import com.ohyes.soolsool.drink.domain.Diary;
import com.ohyes.soolsool.drink.domain.Drink;
import com.ohyes.soolsool.drink.dto.DrinkRequestDto;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DrinkService {

    private final DiaryRepository diaryRepository;
    private final DrinkRepository drinkRepository;
    private final CategoryRepository categoryRepository;

    public void drinkAdd(DrinkRequestDto drinkRequestDto) {
        // 해당 날짜의 일기 검색 (유저 소셜 아이디 로직 추가 필요)
        String date = drinkRequestDto.getDrinkDate();
        int pk;

        // 해당 날짜에 작성된 일기가 이미 있으면 그 일기에 음주 기록만 추가
        if (diaryRepository.existsByDrinkDate(date)) {
            log.info("일기가 이미 존재합니다.");
            pk = diaryRepository.findDiaryPkByDrinkDate(date);
        }
        // 해당 날짜에 작성된 일기가 없으면 일기 저장 후 음주 기록 추가
        else {
            log.info("일기가 존재하지 않습니다.");
            Diary diary = Diary.builder()
                .drinkDate(drinkRequestDto.getDrinkDate())
                .memo(drinkRequestDto.getMemo())
                .img(drinkRequestDto.getImgUrl())
                .hangover(drinkRequestDto.getHangover())
                .alcoholConc(drinkRequestDto.getAlcoholConc())
                .build();

            Diary savedDiary = diaryRepository.save(diary);
            pk = savedDiary.getDiaryPk();
        }

        Drink drink = Drink.builder()
            .drinkUnit(drinkRequestDto.getDrinkUnit())
            .drinkAmount(drinkRequestDto.getDrinkAmount())
            .diary(diaryRepository.findByDiaryPk(pk))
            .category(categoryRepository.findByCategoryName(drinkRequestDto.getCategory()))
            .build();

        drinkRepository.save(drink);
    }

    public void drinkModify(DrinkRequestDto drinkRequestDto) {
        // 해당 날짜의 일기 찾기
        Diary existingDiary = diaryRepository.findByDrinkDate(drinkRequestDto.getDrinkDate());

        // [1] 일기 관련 정보 수정
        if (existingDiary != null) {
            if (drinkRequestDto.getMemo() != null) {
                existingDiary.setMemo(drinkRequestDto.getMemo());
            }
            if (drinkRequestDto.getImgUrl() != null) {
                existingDiary.setImg(drinkRequestDto.getImgUrl());
            }
            if (drinkRequestDto.getHangover() != null) {
                existingDiary.setHangover(drinkRequestDto.getHangover());
            }
            diaryRepository.save(existingDiary);
        }

        // [2] 음주 관련 정보 수정
        List<Drink> drinks = existingDiary.getDrinks();

        // 주종과 단위가 일치하는 음주 기록을 찾는다면 Amount 수정
        drinks.forEach(e -> {
            if (e.getCategory() == categoryRepository.findByCategoryName(
                drinkRequestDto.getCategory())
                && e.getDrinkUnit().equals(drinkRequestDto.getDrinkUnit())) {
                e.setDrinkAmount(drinkRequestDto.getDrinkAmount());
                drinkRepository.save(e);
            }
        });
    }
}
