package com.ohyes.soolsool.drink.application;

import com.ohyes.soolsool.drink.dao.DiaryRepository;
import com.ohyes.soolsool.drink.domain.Diary;
import com.ohyes.soolsool.drink.domain.Drink;
import com.ohyes.soolsool.drink.dto.DailyDrinkDto;
import com.ohyes.soolsool.drink.dto.DailyMainDrink;
import com.ohyes.soolsool.drink.dto.DrinkCount;
import com.ohyes.soolsool.drink.dto.MonthlyDrinkInfoDto;
import com.ohyes.soolsool.drink.dto.TotalDrinkInfoDto;
import com.ohyes.soolsool.user.dao.UserRepository;
import com.ohyes.soolsool.user.domain.User;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DrinkGetService {

    private final UserRepository userRepository;
    private final DiaryRepository diaryRepository;

    public TotalDrinkInfoDto totalDrinkInfoGet(LocalDate drinkDate, Long socialId) {
        // 유저와 날짜가 일치하는 일기 찾기
        User user = userRepository.findBySocialId(socialId);
        Diary exisingDiary = diaryRepository.findByDrinkDateAndUser(drinkDate, user);
        List<Drink> drinks = exisingDiary.getDrinks();

        AtomicInteger drinkTotal = new AtomicInteger();
        AtomicInteger alcoholAmount = new AtomicInteger();
        AtomicReference<LocalDateTime> drinkStartTime = new AtomicReference<>(LocalDateTime.MAX);

        // 음주 기록 계산 (총 음주량, 총 알코올양, 음주 시작 시간)
        drinks.forEach(e -> {
            int amount;
            if (e.getDrinkUnit().equals("잔")) {
                amount = e.getCategory().getGlass() * e.getDrinkAmount();
            } else {
                amount = e.getCategory().getBottle() * e.getDrinkAmount();
            }
            drinkTotal.addAndGet(amount); // 총 음주량
            alcoholAmount.addAndGet((int) (amount * e.getCategory().getVolume() * 0.7984 / 100)); // 총 알코올양

            // 음주 시작 시간 비교
            LocalDateTime recordTime = e.getRecordTime();
            LocalDateTime currentStartTime = drinkStartTime.get();
            if (recordTime.isBefore(currentStartTime)) {
                drinkStartTime.compareAndSet(currentStartTime, recordTime);
            }
        });

        // Dto에 담아서 반환
        return TotalDrinkInfoDto.builder()
            .drinkTotal(drinkTotal.get())
            .alcoholAmount(alcoholAmount.get())
            .drinkStartTime(drinkStartTime.get())
            .height(user.getHeight())
            .weight(user.getWeight())
            .gender(user.getGender())
            .build();
    }

    public MonthlyDrinkInfoDto monthlyDrinkGet(LocalDate drinkDate, Long socialId) {
        User user = userRepository.findBySocialId(socialId);
        List<DailyMainDrink> dailyMainDrinks = new ArrayList<>();

        // 년, 월이 일치하는 일기들 검색
        int year = drinkDate.getYear();
        int month = drinkDate.getMonthValue();
        List<Diary> diaries = diaryRepository.findAllByUserAndDrinkDateYearAndDrinkDateMonth(user, year, month);

        // 각 일기의 drinks마다 가장 많은 양의 주종 저장
        diaries.forEach(d -> {
            AtomicInteger maxAmount = new AtomicInteger(0);
            AtomicReference<String> mainDrink = new AtomicReference<>(null);

            // 양을 계산한 후 최댓값 갱신
            d.getDrinks().forEach(e -> {
                int amount;
                if (e.getDrinkUnit().equals("잔")) {
                    amount = e.getCategory().getGlass() * e.getDrinkAmount();
                } else {
                    amount = e.getCategory().getBottle() * e.getDrinkAmount();
                }

                if (amount > maxAmount.get()) {
                    maxAmount.set(amount);
                    mainDrink.set(e.getCategory().getCategoryName());
                }
            });

            DailyMainDrink dailyMainDrink = DailyMainDrink.builder()
                .date(d.getDrinkDate())
                .mainDrink(String.valueOf(mainDrink))
                .build();

            dailyMainDrinks.add(dailyMainDrink);
        });

        // Dto에 담아서 반환
        return MonthlyDrinkInfoDto.builder()
            .drinks(dailyMainDrinks)
            .build();
    }

    public DailyDrinkDto dailyDrinkGet(LocalDate drinkDate, Long socialId) {
        // 유저와 날짜가 일치하는 일기 찾기
        User user = userRepository.findBySocialId(socialId);
        Diary exisingDiary = diaryRepository.findByDrinkDateAndUser(drinkDate, user);
        List<Drink> drinks = exisingDiary.getDrinks();

        AtomicInteger drinkTotal = new AtomicInteger();
        AtomicInteger alcoholAmount = new AtomicInteger();
        List<DrinkCount> drinkCounts = new ArrayList<>();

        drinks.forEach(e -> {
            int amount;
            if (e.getDrinkUnit().equals("잔")) {
                amount = e.getCategory().getGlass() * e.getDrinkAmount();
            } else {
                amount = e.getCategory().getBottle() * e.getDrinkAmount();
            }
            drinkTotal.addAndGet(amount); // 총 음주량
            alcoholAmount.addAndGet((int) (amount * e.getCategory().getVolume() * 0.7984 / 100)); // 총 알코올양

            DrinkCount drinkCount = DrinkCount.builder()
                .drink(e.getCategory().getCategoryName())
                .count(amount)
                .build();

            drinkCounts.add(drinkCount); // 음주 데이터
        });

        // 성별, 체중에 따른 혈중 알코올 농도 계산
        int index;
        if (user.getGender().equals("남")) {
            index = 7;
        } else {
            index = 6;
        }
        float topConc = (float)((alcoholAmount.get() * 0.7984) / (index * user.getWeight()));

        // Dto에 담아서 반환
        return DailyDrinkDto.builder()
            .date(drinkDate)
            .drinks(drinkCounts)
            .totalDrink(drinkTotal.get())
            .topConc(topConc)
            .build();
    }



    // 중복되는 로직 분리 필요
    /* 일단 보류
    public void dailyDetailDrinkGet(LocalDate drinkDate, Long socialId) {
        // 유저와 날짜가 일치하는 일기 찾기
        User user = userRepository.findBySocialId(socialId);
        Diary existingDiary = diaryRepository.findByDrinkDateAndUser(drinkDate, user);

    }
    */
}
