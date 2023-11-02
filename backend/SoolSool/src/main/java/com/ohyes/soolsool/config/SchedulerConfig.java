package com.ohyes.soolsool.config;

import com.ohyes.soolsool.drink.dao.DiaryRepository;
import com.ohyes.soolsool.drink.domain.Diary;
import com.ohyes.soolsool.drink.domain.Drink;
import com.ohyes.soolsool.user.domain.User;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@EnableAsync
@Slf4j
public class SchedulerConfig {

    @Autowired
    private DiaryRepository diaryRepository;

    // 전날 일기에 대해서 5시에 일괄적으로 혈중 알코올 농도 및 해독 시간 계산
    @Scheduled(cron = "0 0 5 * * *")
    @Transactional
    public void calculate() {
        LocalDate now = LocalDate.now();
        LocalDate previousDay = now.minusDays(1);
        List<Diary> todayDiaries = diaryRepository.findAllByDrinkDate(previousDay);
        log.error("[calculate] 현재 날짜와 시간 : " + LocalDateTime.now());

        todayDiaries.forEach(t -> {
            User user = t.getUser();
            List<Drink> todayDrinks = t.getDrinks();
            AtomicInteger drinkTotal = new AtomicInteger();
            AtomicInteger alcoholAmount = new AtomicInteger();

            todayDrinks.forEach(e -> {
                int amount;
                if (e.getDrinkUnit().equals("잔")) {
                    amount = (int) (e.getCategory().getGlass() * e.getDrinkAmount());
                } else {
                    amount = (int) (e.getCategory().getBottle() * e.getDrinkAmount());
                }
                drinkTotal.addAndGet(amount); // 총 음주량
                alcoholAmount.addAndGet(
                    (int) (amount * e.getCategory().getVolume() * 0.7984 / 100)); // 총 알코올양
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

            t.setAlcoholConc(topConc);
            t.setDetoxTime(detoxTime);
            diaryRepository.save(t);
        });
    }
}
