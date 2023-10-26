package com.ohyes.soolsool.drink.application;

import com.ohyes.soolsool.drink.dao.CategoryRepository;
import com.ohyes.soolsool.drink.dao.DiaryRepository;
import com.ohyes.soolsool.drink.dao.DrinkRepository;
import com.ohyes.soolsool.drink.domain.Diary;
import com.ohyes.soolsool.drink.domain.Drink;
import com.ohyes.soolsool.drink.dto.DrinkInfo;
import com.ohyes.soolsool.drink.dto.DrinkRequestDto;
import com.ohyes.soolsool.user.dao.UserRepository;
import com.ohyes.soolsool.user.domain.User;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;
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
    private final UserRepository userRepository;

    public void drinkAdd(DrinkRequestDto drinkRequestDto, Long socialId) {
        // 해당 날짜의 일기 및 유저 검색
        String date = drinkRequestDto.getDrinkDate();
        User user = userRepository.findBySocialId(socialId);
        int pk;

        // 유저가 해당 날짜에 작성한 일기가 이미 있으면 일기 생성 X
        if (diaryRepository.existsByDrinkDateAndUser(date, user)) {
            log.info("일기가 이미 존재합니다.");
            pk = diaryRepository.findDiaryPkByDrinkDateAndUser(date, user);
        }
        // 유저가 해당 날짜에 작성한 일기가 없으면 일기 생성
        else {
            log.info("일기가 존재하지 않습니다.");
            Diary diary = Diary.builder()
                .user(user)
                .drinkDate(drinkRequestDto.getDrinkDate())
                .memo(drinkRequestDto.getMemo())
                .img(drinkRequestDto.getImgUrl())
                .hangover(drinkRequestDto.getHangover())
                .alcoholConc(drinkRequestDto.getAlcoholConc())
                .build();

            Diary savedDiary = diaryRepository.save(diary);
            pk = savedDiary.getDiaryPk();
        }

        // 해당 일기와 연결해서 음주 기록 저장
        List<DrinkInfo> drinkInfos = drinkRequestDto.getDrinks();
        drinkInfos.forEach(e -> {
            Drink drink = Drink.builder()
                .drinkUnit(e.getDrinkUnit())
                .drinkAmount(e.getDrinkAmount())
                .diary(diaryRepository.findByDiaryPk(pk))
                .category(categoryRepository.findByCategoryName(e.getCategory()))
                .build();

            drinkRepository.save(drink);
        });
    }

    public void drinkModify(DrinkRequestDto drinkRequestDto, Long socialId) {
        // 유저와 날짜가 일치하는 일기 찾기
        User user = userRepository.findBySocialId(socialId);
        Diary existingDiary = diaryRepository.findByDrinkDateAndUser(drinkRequestDto.getDrinkDate(), user);

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
        List<DrinkInfo> drinkInfos = drinkRequestDto.getDrinks(); // 입력 값
        List<Drink> drinks = existingDiary.getDrinks(); // 기존 값

        // 주종과 단위가 일치하는 음주 기록 검색
        drinkInfos.forEach(e -> {
            AtomicBoolean modified = new AtomicBoolean(false);
            drinks.forEach(f -> {
                if (f.getCategory() == categoryRepository.findByCategoryName(
                    e.getCategory())
                    && f.getDrinkUnit().equals(e.getDrinkUnit())) {
                    modified.set(true);
                    f.setDrinkAmount(e.getDrinkAmount());
                    drinkRepository.save(f);
                }
            });

            // 찾지 못했을 경우 새로 저장
            if (!modified.get()) {
                Drink drink = Drink.builder()
                    .drinkUnit(e.getDrinkUnit())
                    .drinkAmount(e.getDrinkAmount())
                    .diary(existingDiary)
                    .category(categoryRepository.findByCategoryName(e.getCategory()))
                    .build();
                drinkRepository.save(drink);
            }
        });
    }

    public void drinkDelete(DrinkRequestDto drinkRequestDto, Long socialId) {
        // 해당 날짜 일기의 음주 기록 찾기
        User user = userRepository.findBySocialId(socialId);
        Diary existingDiary = diaryRepository.findByDrinkDateAndUser(drinkRequestDto.getDrinkDate(), user);
        List<DrinkInfo> drinkInfos = drinkRequestDto.getDrinks(); // 입력 값
        List<Drink> drinks = existingDiary.getDrinks(); // 기존 값
        List<Drink> deletedDrinks = new ArrayList<>();

        // 주종과 단위가 일치하는 음주 기록을 찾는다면 해당 기록 삭제
        drinkInfos.forEach(e -> {
            drinks.forEach(f -> {
                if (f.getCategory() == categoryRepository.findByCategoryName(
                    e.getCategory())
                    && f.getDrinkUnit().equals(e.getDrinkUnit())) {
                    deletedDrinks.add(f);
                    drinkRepository.delete(f);
                }
            });
        });

        // 삭제한 후에 해당 날짜 일기의 음주 기록이 없다면 일기 전체 삭제
        if (drinks.size() == deletedDrinks.size()) {
            diaryRepository.delete(existingDiary);
        }
    }

    public void drinkEventDelete(DrinkRequestDto drinkRequestDto, Long socialId) {
        // 해당 날짜 일기 찾기
        User user = userRepository.findBySocialId(socialId);
        Diary existingDiary = diaryRepository.findByDrinkDateAndUser(drinkRequestDto.getDrinkDate(), user);
        List<Drink> drinks = existingDiary.getDrinks();

        // 음주 기록 전체 삭제
        drinks.forEach(e -> {
            drinkRepository.delete(e);
        });

        // 일기 삭제
        diaryRepository.delete(existingDiary);
    }
}
