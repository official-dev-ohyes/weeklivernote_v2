package com.ohyes.soolsool.drink.application;

import com.ohyes.soolsool.drink.dao.DiaryRepository;
import com.ohyes.soolsool.drink.domain.Diary;
import com.ohyes.soolsool.drink.domain.Drink;
import com.ohyes.soolsool.drink.dto.DailyDetailDrinkDto;
import com.ohyes.soolsool.drink.dto.DailyDrinkDto;
import com.ohyes.soolsool.drink.dto.DailyMainDrink;
import com.ohyes.soolsool.drink.dto.DrinkCount;
import com.ohyes.soolsool.drink.dto.DrinkPercent;
import com.ohyes.soolsool.drink.dto.MonthlyDrinkInfoDto;
import com.ohyes.soolsool.drink.dto.TotalDrinkInfoDto;
import com.ohyes.soolsool.user.dao.UserRepository;
import com.ohyes.soolsool.user.domain.User;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
        User user = userRepository.findBySocialId(socialId).orElseThrow(() -> new NullPointerException("해당 유저가 존재하지 않습니다."));
        Diary existingDiary = diaryRepository.findByDrinkDateAndUser(drinkDate, user).orElseThrow(() -> new NullPointerException("해당 날짜의 일기가 존재하지 않습니다."));
        List<Drink> drinks = existingDiary.getDrinks();

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
        User user = userRepository.findBySocialId(socialId).orElseThrow(() -> new NullPointerException("해당 유저가 존재하지 않습니다."));
        List<DailyMainDrink> dailyMainDrinks = new ArrayList<>();

        // 년, 월이 일치하는 일기들 검색
        int year = drinkDate.getYear();
        int month = drinkDate.getMonthValue();
        List<Diary> diaries = diaryRepository.findAllByUserAndDrinkDateYearAndDrinkDateMonth(user, year, month);

        if (diaries.isEmpty()) {
            throw new NullPointerException("해당 월의 음주 기록이 없습니다.");
        }

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
        User user = userRepository.findBySocialId(socialId).orElseThrow(() -> new NullPointerException("해당 유저가 존재하지 않습니다."));
        Diary existingDiary = diaryRepository.findByDrinkDateAndUser(drinkDate, user).orElseThrow(() -> new NullPointerException("해당 날짜의 일기가 존재하지 않습니다."));
        List<Drink> drinks = existingDiary.getDrinks();

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

        // Dto에 담아서 반환
        return DailyDrinkDto.builder()
            .date(drinkDate)
            .drinks(drinkCounts)
            .totalDrink(drinkTotal.get())
            .topConc(existingDiary.getAlcoholConc())
            .build();
    }

    public DailyDetailDrinkDto dailyDetailDrinkGet(LocalDate drinkDate, Long socialId) {
        // 유저와 날짜가 일치하는 일기 찾기
        User user = userRepository.findBySocialId(socialId).orElseThrow(() -> new NullPointerException("해당 유저가 존재하지 않습니다."));
        Diary existingDiary = diaryRepository.findByDrinkDateAndUser(drinkDate, user).orElseThrow(() -> new NullPointerException("해당 날짜의 일기가 존재하지 않습니다."));

        List<Drink> drinks = existingDiary.getDrinks();
        AtomicReference<LocalDateTime> drinkStartTime = new AtomicReference<>(LocalDateTime.MAX);
        AtomicInteger drinkTotal = new AtomicInteger();
        AtomicInteger alcoholAmount = new AtomicInteger();
        List<Map<String, Object>> drinkInfos = new ArrayList<>(); // 각 주종별 양, 알코올양을 담을 리스트

        drinks.forEach(e -> {
            int amount;
            if (e.getDrinkUnit().equals("잔")) {
                amount = e.getCategory().getGlass() * e.getDrinkAmount();
            } else {
                amount = e.getCategory().getBottle() * e.getDrinkAmount();
            }
            drinkTotal.addAndGet(amount); // 총 음주량
            int alcohol = (int) (amount * e.getCategory().getVolume() * 0.7984 / 100);
            alcoholAmount.addAndGet(alcohol); // 총 알코올양

            Map<String, Object> drinkAmountInfo = new HashMap<>();
            drinkAmountInfo.put("주종", e.getCategory().getCategoryName());
            drinkAmountInfo.put("음주량", amount);
            drinkAmountInfo.put("알코올양", alcohol);
            drinkInfos.add(drinkAmountInfo);

            // 음주 시작 시간 비교
            LocalDateTime recordTime = e.getRecordTime();
            LocalDateTime currentStartTime = drinkStartTime.get();
            if (recordTime.isBefore(currentStartTime)) {
                drinkStartTime.compareAndSet(currentStartTime, recordTime);
            }
        });

        // 퍼센트 계산
        List<DrinkPercent> drinkPercents = new ArrayList<>();
        drinkInfos.forEach(e -> {
            log.info(e.toString());
            DrinkPercent drinkPercent = DrinkPercent.builder()
                .category(e.get("주종").toString())
                .drinkPercent((float)((int)e.get("음주량") * 100 / drinkTotal.get()))
                .alcPercent((float)((int)e.get("알코올양") * 100 / alcoholAmount.get()))
                .build();

            drinkPercents.add(drinkPercent);
        });

        return DailyDetailDrinkDto.builder()
            .date(drinkDate)
            .startTime(drinkStartTime.get())
            .detoxTime(existingDiary.getDetoxTime())
            .drinks(drinkPercents)
            .memo(existingDiary.getMemo())
            .img(existingDiary.getImg())
            .hangover(existingDiary.getHangover())
            .build();
    }
}
