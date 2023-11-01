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
import jakarta.transaction.Transactional;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
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
    private final UploadService uploadService;
    private final CalculateService calculateService;

    @Transactional
    public void drinkAdd(DrinkRequestDto drinkRequestDto, Long socialId) {
        if (drinkRequestDto.getDrinks().isEmpty()) {
            throw new NullPointerException("저장할 음주 정보가 없습니다.(최소 1개 필요)");
        }

        // 해당 날짜의 일기 및 유저 검색
        LocalDate date = drinkRequestDto.getDrinkDate();
        User user = userRepository.findBySocialId(socialId).orElseThrow(() -> new NullPointerException("해당 유저가 존재하지 않습니다."));
        int pk;

        // 유저가 해당 날짜에 작성한 일기가 이미 있으면 일기 생성 X
        if (diaryRepository.existsByDrinkDateAndUser(date, user)) {
            pk = diaryRepository.findDiaryPkByDrinkDateAndUser(date, user);
        }
        // 유저가 해당 날짜에 작성한 일기가 없으면 일기 생성
        else {
            // 오늘 날짜가 아니라면 혈중 알코올 농도, 해독 시간 바로 계산
            // 오늘 날짜면 실시간이거나 변동 가능성이 많으므로 계산 X
            HashMap<String, Float> results = new HashMap<>();
            if (!calculateService.getCorrectDate().equals(date)) {
                results = calculateService.calculateConcAndDetoxTime(drinkRequestDto.getDrinks(), socialId);
            }

            Diary diary = Diary.builder()
                .user(user)
                .drinkDate(drinkRequestDto.getDrinkDate())
                .memo(drinkRequestDto.getMemo())
                .hangover(drinkRequestDto.getHangover())
                .alcoholConc(results.getOrDefault("topConc", 0.0f))
                .detoxTime(results.getOrDefault("detoxTime", 0.0f))
                .build();

            Diary savedDiary = diaryRepository.save(diary);
            pk = savedDiary.getDiaryPk();
        }

        // 해당 일기와 연결해서 음주 기록 저장
        List<DrinkInfo> drinkInfos = drinkRequestDto.getDrinks();
        LocalDateTime startTime;

        // 입력 시간이 있으면 해당 시간, 없으면 실시간으로 기록
        if (drinkRequestDto.getStartTime() != null) {
            startTime = drinkRequestDto.getDrinkDate().atTime(drinkRequestDto.getStartTime());
        } else {
            startTime = LocalDateTime.now();
        }

        drinkInfos.forEach(e -> {
            Drink drink = Drink.builder()
                .drinkUnit(e.getDrinkUnit())
                .drinkAmount(e.getDrinkAmount())
                .recordTime(startTime)
                .diary(diaryRepository.findByDiaryPk(pk))
                .category(categoryRepository.findByCategoryName(e.getCategory()).orElseThrow(() -> new NullPointerException("주종이 바르지 않습니다.")))
                .build();

            drinkRepository.save(drink);
        });
    }

    @Transactional
    public void drinkModify(DrinkRequestDto drinkRequestDto, Long socialId) {
        // 유저와 날짜가 일치하는 일기 찾기
        User user = userRepository.findBySocialId(socialId).orElseThrow(() -> new NullPointerException("해당 유저가 존재하지 않습니다."));
        LocalDate drinkDate = drinkRequestDto.getDrinkDate();
        Diary existingDiary = diaryRepository.findByDrinkDateAndUser(drinkDate, user).orElseThrow(() -> new NullPointerException("해당 날짜의 일기가 존재하지 않습니다."));

        // [1] 일기 관련 정보 수정
        if (existingDiary != null) {
            if (drinkRequestDto.getMemo() != null) {
                existingDiary.setMemo(drinkRequestDto.getMemo());
            }
            if (drinkRequestDto.getHangover() != null) {
                existingDiary.setHangover(drinkRequestDto.getHangover());
            }

            HashMap<String, Float> results = new HashMap<>();
            if (!calculateService.getCorrectDate().equals(drinkDate)) {
                results = calculateService.calculateConcAndDetoxTime(drinkRequestDto.getDrinks(), socialId);
            }
            existingDiary.setAlcoholConc(results.getOrDefault("topConc", 0.0f));
            existingDiary.setDetoxTime(results.getOrDefault("detoxTime", 0.0f));
            diaryRepository.save(existingDiary);
        }

        // [2] 음주 관련 정보 수정
        List<DrinkInfo> drinkInfos = drinkRequestDto.getDrinks(); // 입력 값
        List<Drink> drinks = existingDiary.getDrinks(); // 기존 값

        // 시간이 존재하면 초기화 후 재기록
        if (drinkRequestDto.getStartTime() != null) {
            LocalDateTime startTime = drinkDate.atTime(drinkRequestDto.getStartTime());
            drinkRepository.deleteAll(drinks);

            drinkInfos.forEach(e -> {
                Drink drink = Drink.builder()
                    .drinkUnit(e.getDrinkUnit())
                    .drinkAmount(e.getDrinkAmount())
                    .recordTime(startTime)
                    .diary(existingDiary)
                    .category(categoryRepository.findByCategoryName(e.getCategory()).orElseThrow(() -> new NullPointerException("주종이 바르지 않습니다.")))
                    .build();
                drinkRepository.save(drink);
            });
        // 존재하지 않으면 실시간이므로 수정
        } else {
            LocalDateTime startTime = LocalDateTime.now();
            // 주종과 단위가 일치하는 음주 기록 검색
            drinkInfos.forEach(e -> {
                AtomicBoolean modified = new AtomicBoolean(false);
                drinks.forEach(f -> {
                    if (f.getCategory() == categoryRepository.findByCategoryName(
                        e.getCategory()).orElseThrow(() -> new NullPointerException("주종이 바르지 않습니다."))
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
                        .recordTime(startTime)
                        .diary(existingDiary)
                        .category(categoryRepository.findByCategoryName(e.getCategory()).orElseThrow(() -> new NullPointerException("주종이 바르지 않습니다.")))
                        .build();
                    drinkRepository.save(drink);
                }
            });
        }
    }

    @Transactional
    public void drinkDelete(DrinkRequestDto drinkRequestDto, Long socialId) throws IOException {
        // 해당 날짜 일기의 음주 기록 찾기
        User user = userRepository.findBySocialId(socialId).orElseThrow(() -> new NullPointerException("해당 유저가 존재하지 않습니다."));
        Diary existingDiary = diaryRepository.findByDrinkDateAndUser(drinkRequestDto.getDrinkDate(), user).orElseThrow(() -> new NullPointerException("해당 날짜의 일기가 존재하지 않습니다."));
        List<DrinkInfo> drinkInfos = drinkRequestDto.getDrinks(); // 입력 값
        List<Drink> drinks = existingDiary.getDrinks(); // 기존 값

        if (drinkInfos.isEmpty()) {
            throw new NullPointerException("삭제할 음주 정보가 없습니다.(최소 1개 필요)");
        } else if (drinkInfos.size() > drinks.size()) {
            throw new NullPointerException("삭제 요청 개수가 잘못되었습니다.");
        }
        List<Drink> deletedDrinks = new ArrayList<>();

        // 주종과 단위가 일치하는 음주 기록을 찾는다면 해당 기록 삭제
        drinkInfos.forEach(e -> {
            drinks.forEach(f -> {
                if (f.getCategory() == categoryRepository.findByCategoryName(
                    e.getCategory()).orElseThrow(() -> new NullPointerException("주종이 바르지 않습니다."))
                    && f.getDrinkUnit().equals(e.getDrinkUnit())) {
                    deletedDrinks.add(f);
                    drinkRepository.delete(f);
                }
            });
        });

        // 삭제한 후에 해당 날짜 일기의 음주 기록이 없다면 일기 전체 삭제
        if (drinks.size() == deletedDrinks.size()) {
            if (existingDiary.getImg() != null) {
                uploadService.drinkPhotoDelete(existingDiary, existingDiary.getImg());
            }
            diaryRepository.delete(existingDiary);
        }
    }

    public void drinkEventDelete(LocalDate drinkDate, Long socialId) throws IOException {
        // 해당 날짜 일기 찾기
        User user = userRepository.findBySocialId(socialId).orElseThrow(() -> new NullPointerException("해당 유저가 존재하지 않습니다."));
        Diary existingDiary = diaryRepository.findByDrinkDateAndUser(drinkDate, user).orElseThrow(() -> new NullPointerException("해당 날짜의 일기가 존재하지 않습니다."));
        List<Drink> drinks = existingDiary.getDrinks();

        // 음주 기록 전체 삭제
        drinkRepository.deleteAll(drinks);

        // 일기 및 사진 삭제
        if (existingDiary.getImg() != null) {
            uploadService.drinkPhotoDelete(existingDiary, existingDiary.getImg());
        }
        diaryRepository.delete(existingDiary);
    }
}
