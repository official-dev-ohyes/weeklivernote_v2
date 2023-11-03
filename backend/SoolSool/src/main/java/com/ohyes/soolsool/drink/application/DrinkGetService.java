package com.ohyes.soolsool.drink.application;

import com.ohyes.soolsool.drink.dao.DiaryRepository;
import com.ohyes.soolsool.drink.domain.Diary;
import com.ohyes.soolsool.drink.domain.Drink;
import com.ohyes.soolsool.drink.dto.DailyDetailDrinkDto;
import com.ohyes.soolsool.drink.dto.DailyDrinkDto;
import com.ohyes.soolsool.drink.dto.DailyMainDrink;
import com.ohyes.soolsool.drink.dto.DrinkCount;
import com.ohyes.soolsool.drink.dto.DrinkInfo;
import com.ohyes.soolsool.drink.dto.DrinkPercent;
import com.ohyes.soolsool.drink.dto.MonthlyDrinkInfoDto;
import com.ohyes.soolsool.drink.dto.TotalDrinkInfoDto;
import com.ohyes.soolsool.user.dao.UserRepository;
import com.ohyes.soolsool.user.domain.User;
import java.text.DecimalFormat;
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
        User user = userRepository.findBySocialId(socialId)
            .orElseThrow(() -> new NullPointerException("해당 유저가 존재하지 않습니다."));
        Diary existingDiary = diaryRepository.findByDrinkDateAndUser(drinkDate, user)
            .orElseThrow(() -> new NullPointerException("해당 날짜의 일기가 존재하지 않습니다."));
        List<Drink> drinks = existingDiary.getDrinks();

        AtomicInteger drinkTotal = new AtomicInteger();
        AtomicInteger alcoholAmount = new AtomicInteger();
        AtomicReference<LocalDateTime> drinkStartTime = new AtomicReference<>(LocalDateTime.MAX);
        List<DrinkInfo> drinkInfos = new ArrayList<>();

        // 음주 기록 계산 (총 음주량, 총 알코올양, 음주 시작 시간)
        drinks.forEach(e -> {
            int amount;
            if (e.getDrinkUnit().equals("잔")) {
                amount = (int) (e.getCategory().getGlass() * e.getDrinkAmount());
            } else {
                amount = (int) (e.getCategory().getBottle() * e.getDrinkAmount());
            }
            drinkTotal.addAndGet(amount); // 총 음주량
            alcoholAmount.addAndGet(
                (int) (amount * e.getCategory().getVolume() * 0.7984 / 100)); // 총 알코올양

            // 음주 시작 시간 비교
            LocalDateTime recordTime = e.getRecordTime();
            LocalDateTime currentStartTime = drinkStartTime.get();
            if (recordTime.isBefore(currentStartTime)) {
                drinkStartTime.compareAndSet(currentStartTime, recordTime);
            }

            // 음주 정보 저장
            DrinkInfo drinkInfo = DrinkInfo.builder()
                .category(e.getCategory().getCategoryName())
                .drinkUnit(e.getDrinkUnit())
                .drinkAmount(e.getDrinkAmount())
                .build();
            drinkInfos.add(drinkInfo);
        });

        // Dto에 담아서 반환
        return TotalDrinkInfoDto.builder()
            .drinkTotal(drinkTotal.get())
            .alcoholAmount(alcoholAmount.get())
            .drinkStartTime(drinkStartTime.get())
            .drinks(drinkInfos)
            .height(user.getHeight())
            .weight(user.getWeight())
            .gender(user.getGender())
            .build();
    }

    public MonthlyDrinkInfoDto monthlyDrinkGet(LocalDate drinkDate, Long socialId) {
        User user = userRepository.findBySocialId(socialId)
            .orElseThrow(() -> new NullPointerException("해당 유저가 존재하지 않습니다."));
        List<DailyMainDrink> dailyMainDrinks = new ArrayList<>();

        // 년, 월이 일치하는 일기들 검색
        int year = drinkDate.getYear();
        int month = drinkDate.getMonthValue();
        List<Diary> diaries = diaryRepository.findAllByUserAndDrinkDateYearAndDrinkDateMonth(user,
            year, month);

        // 각 일기의 drinks마다 가장 많은 양의 주종 저장
        diaries.forEach(d -> {
            List<Drink> drinks = d.getDrinks();
            AtomicInteger maxAmount = new AtomicInteger(0);
            AtomicReference<String> mainDrink = new AtomicReference<>(null);

            Map<String, Integer> categoryTotalMap = new HashMap<>(); // 주종별로 합계를 저장할 맵
            for (Drink drink : drinks) {
                String categoryName = drink.getCategory().getCategoryName();
                int amount;
                if (drink.getDrinkUnit().equals("잔")) {
                    amount = (int) (drink.getCategory().getGlass() * drink.getDrinkAmount());
                } else {
                    amount = (int) (drink.getCategory().getBottle() * drink.getDrinkAmount());
                }

                // 주종별 합계를 맵에 추가 또는 갱신
                categoryTotalMap.put(categoryName,
                    categoryTotalMap.getOrDefault(categoryName, 0) + amount);
            }

            // 양을 계산한 후 최댓값 갱신
            for (Map.Entry<String, Integer> entry : categoryTotalMap.entrySet()) {
                String categoryName = entry.getKey();
                int drinkAmount = entry.getValue();

                if (drinkAmount > maxAmount.get()) {
                    mainDrink.set(categoryName);
                    maxAmount.set(drinkAmount);
                }
            }

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
        User user = userRepository.findBySocialId(socialId)
            .orElseThrow(() -> new NullPointerException("해당 유저가 존재하지 않습니다."));
        Diary existingDiary = diaryRepository.findByDrinkDateAndUser(drinkDate, user)
            .orElseThrow(() -> new NullPointerException("해당 날짜의 일기가 존재하지 않습니다."));
        List<Drink> drinks = existingDiary.getDrinks();

        AtomicInteger drinkTotal = new AtomicInteger();
        Map<String, Integer> categoryTotalMap = new HashMap<>(); // 주종별로 합계를 저장할 맵

        for (Drink drink : drinks) {
            String categoryName = drink.getCategory().getCategoryName();
            int amount;
            if (drink.getDrinkUnit().equals("잔")) {
                amount = (int) (drink.getCategory().getGlass() * drink.getDrinkAmount());
            } else {
                amount = (int) (drink.getCategory().getBottle() * drink.getDrinkAmount());
            }

            // 주종별 합계를 맵에 추가 또는 갱신
            categoryTotalMap.put(categoryName,
                categoryTotalMap.getOrDefault(categoryName, 0) + amount);

            drinkTotal.addAndGet(amount);
        }

        List<DrinkCount> drinkCounts = new ArrayList<>(); // 주종별로 묶어서 채워야함
        for (Map.Entry<String, Integer> entry : categoryTotalMap.entrySet()) {
            String categoryName = entry.getKey();
            int drinkAmount = entry.getValue();

            // DrinkCount 객체 생성
            DrinkCount drinkCount = DrinkCount.builder()
                .drink(categoryName)
                .count(drinkAmount)
                .build();

            drinkCounts.add(drinkCount);
        }

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
        User user = userRepository.findBySocialId(socialId)
            .orElseThrow(() -> new NullPointerException("해당 유저가 존재하지 않습니다."));
        Diary existingDiary = diaryRepository.findByDrinkDateAndUser(drinkDate, user)
            .orElseThrow(() -> new NullPointerException("해당 날짜의 일기가 존재하지 않습니다."));

        List<Drink> drinks = existingDiary.getDrinks();
        AtomicReference<LocalDateTime> drinkStartTime = new AtomicReference<>(LocalDateTime.MAX);

        AtomicInteger drinkTotal = new AtomicInteger();
        AtomicInteger alcoholTotal = new AtomicInteger();
        Map<String, List<Integer>> categoryTotalMap = new HashMap<>(); // 주종별로 합계를 저장할 맵

        for (Drink drink : drinks) {
            String categoryName = drink.getCategory().getCategoryName();
            int amount;
            if (drink.getDrinkUnit().equals("잔")) {
                amount = (int) (drink.getCategory().getGlass() * drink.getDrinkAmount());
            } else {
                amount = (int) (drink.getCategory().getBottle() * drink.getDrinkAmount());
            }
            int alcohol = (int) (amount * drink.getCategory().getVolume() * 0.7984 / 100);
            // 주종별 합계를 맵에 추가 또는 갱신

            if (categoryTotalMap.containsKey(categoryName)) {
                // 이미 해당 주종이 맵에 존재하면 리스트에서 값을 가져와 갱신
                List<Integer> categoryTotal = categoryTotalMap.get(categoryName);
                categoryTotal.set(0, categoryTotal.get(0) + amount); // amount 합계 갱신
                categoryTotal.set(1, categoryTotal.get(1) + alcohol); // alcohol 합계 갱신
            } else {
                // 해당 주종이 맵에 존재하지 않으면 새로운 리스트를 만들어 값을 추가
                List<Integer> categoryTotal = new ArrayList<>();
                categoryTotal.add(amount); // amount 합계
                categoryTotal.add(alcohol); // alcohol 합계
                categoryTotalMap.put(categoryName, categoryTotal);
            }

            drinkTotal.addAndGet(amount);
            alcoholTotal.addAndGet(alcohol);

            // 음주 시작 시간 비교
            LocalDateTime recordTime = drink.getRecordTime();
            LocalDateTime currentStartTime = drinkStartTime.get();
            if (recordTime.isBefore(currentStartTime)) {
                drinkStartTime.compareAndSet(currentStartTime, recordTime);
            }
        }

        // 퍼센트 계산
        List<DrinkPercent> drinkPercents = new ArrayList<>();
        DecimalFormat decimalFormat = new DecimalFormat("#.00");
        for (Map.Entry<String, List<Integer>> entry : categoryTotalMap.entrySet()) {
            String categoryName = entry.getKey();
            List<Integer> drinkInfo = entry.getValue();

            String drinkPercentForm = decimalFormat.format(
                (float) (drinkInfo.get(0) * 100) / drinkTotal.get());
            String alcPercentForm = decimalFormat.format(
                (float) (drinkInfo.get(1) * 100) / alcoholTotal.get());

            // DrinkCount 객체 생성
            DrinkPercent drinkPercent = DrinkPercent.builder()
                .category(categoryName)
                .drinkPercent(Float.parseFloat(drinkPercentForm))
                .alcPercent(Float.parseFloat(alcPercentForm))
                .build();

            drinkPercents.add(drinkPercent);
        }

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
