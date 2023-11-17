package com.ohyes.soolsool.config;

import com.ohyes.soolsool.drink.dao.DiaryRepository;
import com.ohyes.soolsool.drink.domain.Diary;
import com.ohyes.soolsool.drink.domain.Drink;
import com.ohyes.soolsool.user.dao.UserRepository;
import com.ohyes.soolsool.user.domain.User;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;
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

    @Autowired
    private UserRepository userRepository;

    // 전날 일기에 대해서 5시에 일괄적으로 혈중 알코올 농도 및 해독 시간 계산
    @Scheduled(cron = "0 0 5 * * *")
    @Transactional
    public void calculate() {
        // 모든 유저에 대해 알콜양 하루치 차감
        List<User> allUsers = userRepository.findAll();
        allUsers.forEach(e -> {
            float blood = (float) (e.getTodayBloodAlcohol() - 0.36);
            float liver = (float) (e.getTodayLiverAlcohol() - 172.8);
            float bloodAlcohol = (blood > 0) ? blood : 0.0F;
            float liverAlcohol = (liver > 0) ? liver : 0.0F;

            e.setTodayBloodAlcohol(bloodAlcohol);
            e.setTodayLiverAlcohol(liverAlcohol);
            userRepository.save(e);
        });

        LocalDate now = LocalDate.now();
        LocalDate previousDay = now.minusDays(1);
        List<Diary> todayDiaries = diaryRepository.findAllByDrinkDate(previousDay);
        log.error("[calculate] 현재 날짜와 시간 : " + LocalDateTime.now());

        todayDiaries.forEach(t -> {
            User user = t.getUser();
            List<Drink> todayDrinks = t.getDrinks();
            AtomicInteger drinkTotal = new AtomicInteger();
            AtomicInteger alcoholAmount = new AtomicInteger();
            AtomicReference<LocalDateTime> drinkStartTime = new AtomicReference<>(LocalDateTime.MAX);

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

                // 음주 시작 시간 비교
                LocalDateTime recordTime = e.getRecordTime();
                LocalDateTime currentStartTime = drinkStartTime.get();
                if (recordTime.isBefore(currentStartTime)) {
                    drinkStartTime.compareAndSet(currentStartTime, recordTime);
                }
            });

            // 성별, 체중에 따른 혈중 알코올 농도 계산
            float index;
            if (user.getGender().equals("남자")) {
                index = 8.6F;
            } else {
                index = 6.4F;
            }
            float topConc = (float) ((alcoholAmount.get() * 0.7) / (index * user.getWeight()));
            float detoxTime = (float) (200 * topConc / 3);

            // 다음날 05시 - 기록 시간 계산해서 알콜양 계산
            LocalDateTime recordTime = drinkStartTime.get();
            LocalDateTime currentTime = LocalDateTime.now();

            Duration duration = Duration.between(recordTime, currentTime);
            long minutes = duration.toMinutes();

            float calcBlood = (float) (user.getTodayBloodAlcohol() + topConc - (0.015 * minutes / 60));
            float calcLiver = (float) (user.getTodayLiverAlcohol() + alcoholAmount.get() - (minutes * 60 * 0.002));
            float bloodAlcohol = (calcBlood > 0) ? calcBlood : 0.0F;
            float liverAlcohol = (calcLiver > 0) ? calcLiver : 0.0F;

            t.setAlcoholConc(topConc);
            t.setDetoxTime(detoxTime);
            user.setTodayBloodAlcohol(bloodAlcohol);
            user.setTodayLiverAlcohol(liverAlcohol);
            diaryRepository.save(t);
            userRepository.save(user);
        });
    }
}
