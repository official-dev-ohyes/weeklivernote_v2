package com.ohyes.soolsool.drink.application;

import com.ohyes.soolsool.drink.dao.CategoryRepository;
import com.ohyes.soolsool.drink.domain.Category;
import com.ohyes.soolsool.drink.dto.DrinkInfo;
import com.ohyes.soolsool.user.domain.User;
import com.ohyes.soolsool.util.UserDetailsImpl;
import com.ohyes.soolsool.util.UserUtils;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CalculateService {

    private final CategoryRepository categoryRepository;

    @Transactional
    public LocalDate getCorrectDate() {
        LocalTime currentTime = LocalTime.now();

        LocalTime am12 = LocalTime.of(0, 0); // 자정
        LocalTime am5 = LocalTime.of(5, 0); // 새벽 5시

        // 현재 시간이 AM 12시부터 AM 5시 이전인 경우
        if (currentTime.isAfter(am12) && currentTime.isBefore(am5)) {
            return LocalDate.now().minusDays(1);
        } else {
            // 그 외 시간대에는 현재 날짜 반환
            return LocalDate.now();
        }
    }

    @Transactional
    public HashMap<String, Float> calculateConcAndDetoxTime(List<DrinkInfo> drinks, UserDetailsImpl userDetails) {
        User user = UserUtils.getUserFromToken(userDetails);
        AtomicInteger drinkTotal = new AtomicInteger();
        AtomicInteger alcoholAmount = new AtomicInteger();

        drinks.forEach(e -> {
            Category category = categoryRepository.findByCategoryName(e.getCategory())
                .orElseThrow();
            int amount;
            if (e.getDrinkUnit().equals("잔")) {
                amount = (int) (category.getGlass() * e.getDrinkAmount());
            } else {
                amount = (int) (category.getBottle() * e.getDrinkAmount());
            }
            drinkTotal.addAndGet(amount); // 총 음주량
            alcoholAmount.addAndGet((int) (amount * category.getVolume() * 0.7984 / 100)); // 총 알코올양
        });

        // 성별, 체중에 따른 혈중 알코올 농도 계산
        float index;
        if (user.getGender().equals("남")) {
            index = 8.6F;
        } else {
            index = 6.4F;
        }
        float topConc = (float) ((alcoholAmount.get() * 0.7) / (index * user.getWeight()));
        float detoxTime = (float) (200 * topConc / 3);

        // 해시맵으로 반환
        HashMap<String, Float> results = new HashMap<>();
        results.put("topConc", topConc);
        results.put("detoxTime", detoxTime);

        return results;
    }
}
