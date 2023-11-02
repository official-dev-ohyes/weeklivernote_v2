package com.ohyes.soolsool.drink.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Drink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "drink_pk")
    private int drinkPk;

    @Column(name = "drink_amount")
    private float drinkAmount;

    @Column(name = "drink_unit")
    private String drinkUnit;

    @Column(name = "record_time")
    private LocalDateTime recordTime; // 음주 기록 생성 시간

    // 연관 관계
    @ManyToOne
    @JoinColumn(name = "diary_pk")
    private Diary diary;

    @ManyToOne
    @JoinColumn(name = "category_pk")
    private Category category;

    // 생성자
    @Builder
    public Drink(String drinkUnit, float drinkAmount, LocalDateTime recordTime, Diary diary, Category category) {
        this.drinkUnit = drinkUnit;
        this.drinkAmount = drinkAmount;
        this.recordTime = recordTime;
        this.diary = diary;
        this.category = category;
    }
}
