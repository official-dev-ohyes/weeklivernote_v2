package com.ohyes.soolsool.user.application;

import com.ohyes.soolsool.drink.dao.DiaryRepository;
import com.ohyes.soolsool.drink.dao.DrinkRepository;
import com.ohyes.soolsool.drink.domain.Diary;
import com.ohyes.soolsool.drink.domain.Drink;
import com.ohyes.soolsool.user.dao.UserChartDataInterface;
import com.ohyes.soolsool.user.dao.UserRepository;
import com.ohyes.soolsool.user.domain.User;
import com.ohyes.soolsool.user.dto.UserChartDto;
import com.ohyes.soolsool.user.dto.UserStatChartResponseDto;
import com.ohyes.soolsool.user.dto.UserStatResponseDto;

import java.util.ArrayList;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserStatService {

    private final UserRepository userRepository;
    private final DrinkRepository drinkRepository;
    private final DiaryRepository diaryRepository;

    public UserStatResponseDto getUserStat(Long socialId) {
        // 유저 정보 인증
        User user = userRepository.findBySocialId(socialId).orElseThrow(() -> new NullPointerException("해당 유저가 존재하지 않습니다."));

        // 유저의 현재 논 알코올 기간
        LocalDate now = LocalDate.now();
        LocalDate startNonAlcDate = user.getStartNonalcoholDate();
        int nowNonAlcPeriod = Math.abs((int) ChronoUnit.DAYS.between(startNonAlcDate, now));

        // 유저의 최장 논 알코올 기간
        int maxNonAlcPeriod = user.getMaxNonalcoholPeriod();

        if (maxNonAlcPeriod < nowNonAlcPeriod) {    // 현재 논 알코올 기간이 더 길다면 최장 논 알코올 기간 업데이트
            maxNonAlcPeriod = nowNonAlcPeriod;
            user.setMaxNonalcoholPeriod(maxNonAlcPeriod);
            userRepository.save(user);
        }

        // 유저의 올해 음주량
        int year = now.getYear();
        long totalInGlass = drinkRepository.getTotalDrinkAmountInGlass(user.getSocialId(), year);
        long totalInBottle = drinkRepository.getTotalDrinkAmountInBottle(user.getSocialId(), year);

        return UserStatResponseDto.builder().nowNonAlcPeriod(nowNonAlcPeriod).maxNonAlcPeriod(maxNonAlcPeriod).drinkYearAmount(totalInGlass + totalInBottle).build();
    }


    public UserStatChartResponseDto getUserStatChart(Long socialId) {
        User user = userRepository.findBySocialId(socialId).orElseThrow(() -> new NullPointerException("해당 유저가 존재하지 않습니다."));
        LocalDate now = LocalDate.now();
        LocalDate startDate = now.minusDays(6);

        List<UserChartDataInterface> drinks = drinkRepository.getWeeklyDrinkAmountInGlass(user.getSocialId(), startDate, now);

//        for (int i = 0; i < drinks.size() - 1; i++) {
//            drinks.get(i)
////            LocalDate currentDrinkDate = diaries.get(i).getDrinkDate();
////            LocalDate nextDrinkDate = diaries.get(i + 1).getDrinkDate();
//
//        }

        for (UserChartDataInterface drink : drinks) {
            System.out.println("드링크 " + drink); // 각 Drink 객체를 출력합니다.
            System.out.println("드링크 " + drink.getDrinkDate() + "  " + "  " ) ; // 각 Drink 객체를 출력합니다.
        }


        return UserStatChartResponseDto.builder()
                .temp("고마워")
                .build();
    }

//    public List<BarDataDto> getChartData(@PathVariable Long userId) {
//        LocalDate toDate = LocalDate.now();
//        LocalDate fromDate = toDate.minusDays(6);
//        List<UserDrinkRecord> drinkRecords = userDrinkRecordRepository.findRecentDrinkRecords(userId, fromDate, toDate);
//
//        List<BarDataDto> barData = new ArrayList<>();
//        for (UserDrinkRecord record : drinkRecords) {
//            barData.add(new BarDataDto(record.getAmount(), record.getDate().getDayOfWeek().toString(), null));
//        }
//
//        return barData;
//    }

//    import java.time.LocalDate;
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//    public class DrinkDtoConverter {
//        public static Map<String, Object> convertToDto(List<Diary> diaries) {
//            // DTO를 생성하기 위한 데이터 구조
//            Map<String, Object> dto = new HashMap<>();
//            Map<String, List<Map<String, Object>>> yearlyData = new HashMap<>();
//            List<Map<String, Object>> weeklyBarData = new ArrayList<>();
//            List<Map<String, Object>> weeklyLineData = new ArrayList<>();
//
//            // 오늘부터 최근 7일간의 날짜를 구합니다.
//            LocalDate today = LocalDate.now();
//            LocalDate startDate = today.minusDays(6); // 최근 7일간의 시작 날짜
//
//            // 주어진 기간(오늘부터 최근 7일간) 내에 해당하는 drink 기록을 조회합니다.
//            for (Diary diary : diaries) {
//                LocalDate drinkDate = diary.getDrinkDate();
//                if (drinkDate.isAfter(startDate) && !drinkDate.isAfter(today)) {
//                    List<Drink> drinks = diary.getDrinks();
//                    for (Drink drink : drinks) {
//                        float drinkAmount = drink.getDrinkAmount();
//                        String drinkUnit = drink.getDrinkUnit();
//                        Category category = drink.getCategory();
//
//                        // drink_unit에 따라서 해당하는 category의 glass 또는 bottle 값을 가져옵니다.
//                        float categoryValue = 0.0f;
//                        if (drinkUnit.equals("잔")) {
//                            categoryValue = category.getGlass();
//                        } else if (drinkUnit.equals("병")) {
//                            categoryValue = category.getBottle();
//                        }
//
//                        // drink_amount와 category의 값을 곱하여 DTO 데이터를 가공합니다.
//                        float value = drinkAmount * categoryValue;
//
//                        // 주간 데이터를 가공하여 weeklyBarData와 weeklyLineData에 추가합니다.
//                        String label = drinkDate.getDayOfWeek().toString();
//                        Map<String, Object> barData = new HashMap<>();
//                        barData.put("value", value);
//                        barData.put("label", label);
//
//                        Map<String, Object> lineData = new HashMap<>();
//                        lineData.put("value", value);
//                        lineData.put("label", label);
//
//                        weeklyBarData.add(barData);
//                        weeklyLineData.add(lineData);
//                    }
//                }
//            }
//
//            // DTO에 데이터를 저장합니다.
//            dto.put("weekly", Map.of("bar", weeklyBarData, "line", weeklyLineData));
//            dto.put("yearly", yearlyData);
//
//            return dto;
//        }
//    }






    public void updateStartNonAlcDate(User user, LocalDate drinkDate) {
        if (drinkDate != null) {   // 실시간 일기 작성시 작성 날짜로 업데이트
            user.setStartNonalcoholDate(drinkDate);
            userRepository.save(user);
        } else {    // 기록 삭제 시 유저의 최근 일기 drinkDate 로 업데이트
            List<Diary> diaries = diaryRepository.findByUserOrderByDrinkDateDesc(user);
            user.setStartNonalcoholDate(diaries.get(0).getDrinkDate());
            userRepository.save(user);
        }
    }

    public void updateMaxNonAlcPeriod(User user) {
        List<Diary> diaries = diaryRepository.findByUserOrderByDrinkDateDesc(user);
        int maxDayDiff = 0;

        for (int i = 0; i < diaries.size() - 1; i++) {
            LocalDate currentDrinkDate = diaries.get(i).getDrinkDate();
            LocalDate nextDrinkDate = diaries.get(i + 1).getDrinkDate();

            // 두 날짜의 차이 구하기
            int dayDiff = Math.abs((int) ChronoUnit.DAYS.between(currentDrinkDate, nextDrinkDate));

            if (dayDiff > maxDayDiff) {
                maxDayDiff = dayDiff;
            }
        }
        user.setMaxNonalcoholPeriod(maxDayDiff);
        userRepository.save(user);
    }
}
