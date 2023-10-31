package com.ohyes.soolsool.user.application;

import com.ohyes.soolsool.drink.dao.DrinkRepository;
import com.ohyes.soolsool.user.dao.UserRepository;
import com.ohyes.soolsool.user.domain.User;
import com.ohyes.soolsool.user.dto.UserStatResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserStatService {

    private final UserRepository userRepository;
    private final DrinkRepository drinkRepository;

    public UserStatResponseDto getUserStat(Long socialId) {
        // 유저 정보 인증
        User user = userRepository.findBySocialId(socialId).orElseThrow(() -> new NullPointerException("해당 유저가 존재하지 않습니다."));


        // 유저의 현재 논 알코올 기간

        // 유저의 최장 논 알코올 기간


        // 올해 음주량
        LocalDate now = LocalDate.now();
        int year = now.getYear();
        long totalInGlass = drinkRepository.getTotalDrinkAmountInGlass(user.getSocialId(), year);
        long totalInBottle = drinkRepository.getTotalDrinkAmountInBottle(user.getSocialId(), year);

        return UserStatResponseDto.builder().nowNonAlcPeriod(1).maxNonAlcPeriod(1).drinkYearAmount(totalInGlass + totalInBottle).build();
    }
}
