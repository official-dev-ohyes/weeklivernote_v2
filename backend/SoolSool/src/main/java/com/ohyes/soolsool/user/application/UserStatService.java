package com.ohyes.soolsool.user.application;

import com.ohyes.soolsool.drink.dao.DiaryRepository;
import com.ohyes.soolsool.drink.dao.DrinkRepository;
import com.ohyes.soolsool.drink.domain.Diary;
import com.ohyes.soolsool.user.dao.UserRepository;
import com.ohyes.soolsool.user.domain.User;
import com.ohyes.soolsool.user.dto.ChartDataDto;
import com.ohyes.soolsool.user.dto.UserStatChartResponseDto;
import com.ohyes.soolsool.user.dto.UserStatResponseDto;
import com.ohyes.soolsool.user.dto.WeeklyCharDto;
import com.ohyes.soolsool.user.dto.YearlyChartDataDto;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

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

        // weekly 술 총량
        Map<LocalDate, ChartDataDto> drinkDataMap = new HashMap<>();
        for (int i = 0; i < 7; i++) {
            LocalDate date = startDate.plusDays(i);
            drinkDataMap.put(date, new ChartDataDto(date, 0.0));
        }

        List<ChartDataDto> drinkData = drinkRepository.getDrinkData(user.getSocialId(), startDate,
            now);
        for (ChartDataDto drink : drinkData) {
            drinkDataMap.put(drink.getDate(), drink);
        }

        ArrayList<ChartDataDto> sortedDrinkList = new ArrayList<>(drinkDataMap.values());
        sortedDrinkList.sort(Comparator.comparing(ChartDataDto::getDate));

        // weekly 알코올 총량
        Map<LocalDate, ChartDataDto> alcDataMap = new HashMap<>();
        for (int i = 0; i < 7; i++) {
            LocalDate date = startDate.plusDays(i);
            alcDataMap.put(date, new ChartDataDto(date, 0.0));
        }

        List<ChartDataDto> alcData = drinkRepository.getAlcData(user.getSocialId(), startDate, now);
        for (ChartDataDto drink : alcData) {
            alcDataMap.put(drink.getDate(), drink);
        }

        ArrayList<ChartDataDto> sortedAlcList = new ArrayList<>(alcDataMap.values());
        sortedAlcList.sort(Comparator.comparing(ChartDataDto::getDate));

        WeeklyCharDto weeklyChart = new WeeklyCharDto();
        weeklyChart.setBar(sortedDrinkList);
        weeklyChart.setLine(sortedAlcList);

        // yearly
        Map<Integer, YearlyChartDataDto> yearlyDrinkDataMap = new HashMap<>();
        for (int i = 1; i <= 12; i++) {
            yearlyDrinkDataMap.put(i, new YearlyChartDataDto(i, 0));
        }

        int year = now.getYear();
        List<YearlyChartDataDto> yearlyData = drinkRepository.getYearlyData(user.getSocialId(),
            year);
        for (YearlyChartDataDto drink : yearlyData) {
            yearlyDrinkDataMap.put(drink.getMonth(), drink);
        }

        ArrayList<YearlyChartDataDto> sortedYearlyList = new ArrayList<>(
            yearlyDrinkDataMap.values());
        sortedYearlyList.sort(Comparator.comparing(YearlyChartDataDto::getMonth));

//        List<YearlyChartDataDto> yearlyDataMap = new ArrayList<>();
//        for (int month = 1; month <= 12; month++) {
//            boolean found = false;
//            for (YearlyChartDataDto yearlyChartData : yearlyData) {
//                if (yearlyChartData.getMonth() == month) {
//                    yearlyDataMap.add(yearlyChartData);
//                    found = true;
//                    break;
//                }
//            }
//            if (!found) {
//                YearlyChartDataDto emptyData = new YearlyChartDataDto(month, 0.0);
//                yearlyDataMap.add(emptyData);
//            }
//        }

        UserStatChartResponseDto response = new UserStatChartResponseDto();
        response.setWeekly(weeklyChart);
        response.setYearly(sortedYearlyList);

        return response;
    }

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
