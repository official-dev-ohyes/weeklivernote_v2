package com.ohyes.soolsool.drink.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalTime;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Getter
@Setter
@ToString
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Entity
public class Drink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "drink_pk")
    private int drinkPk;

    @Column(name = "drink_amount")
    private byte drinkAmount;

    @Column(name = "drink_unit")
    private String drinkUnit;

    @CreatedDate
    @Column(name = "record_time")
    private LocalTime recordTime; // 음주 기록 생성 시간

    // 연관 관계
    @ManyToOne
    @JoinColumn(name = "diary_pk")
    private Diary diary;

    @ManyToOne
    @JoinColumn(name = "category_pk")
    private Category category;

    // 생성자
    @Builder
    public Drink(String drinkUnit, byte drinkAmount, Diary diary, Category category) {
        this.drinkUnit = drinkUnit;
        this.drinkAmount = drinkAmount;
        this.diary = diary;
        this.category = category;
    }
}
