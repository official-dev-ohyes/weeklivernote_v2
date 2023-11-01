package com.ohyes.soolsool.user.application;

import com.ohyes.soolsool.drink.dao.DiaryRepository;
import com.ohyes.soolsool.drink.dao.DrinkRepository;
import com.ohyes.soolsool.drink.domain.Diary;
import com.ohyes.soolsool.user.dao.UserRepository;
import com.ohyes.soolsool.user.domain.User;
import com.ohyes.soolsool.user.dto.UserStatResponseDto;
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
        int nowNonAlcPeriod = (int) ChronoUnit.DAYS.between(now, startNonAlcDate);

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
