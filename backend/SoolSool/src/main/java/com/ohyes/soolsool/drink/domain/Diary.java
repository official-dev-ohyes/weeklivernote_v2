package com.ohyes.soolsool.drink.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Getter
@Setter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Entity
public class Diary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "diary_pk")
    private int diaryPk;

    @Column(name = "drink_date", columnDefinition = "DATE")
    private String drinkDate;

    @Column(name = "memo")
    private String memo;

    @Column(name = "img")
    private String img;

    @Column(name = "hangover")
    private String hangover;

    @Column(name = "alcohol_conc")
    private float alcoholConc;

    @CreatedDate
    @Column(name = "created_at")
    private Date createAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private Date updatedAt;

    // 연관 관계 (유저 추가 필요)
    @OneToMany(mappedBy = "diary")
    private List<Drink> drinks = new ArrayList<>();

    // 생성자
    @Builder
    public Diary(String drinkDate, String memo, String img, String hangover, float alcoholConc) {
        this.drinkDate = drinkDate;
        this.memo = memo;
        this.img = img;
        this.hangover = hangover;
        this.alcoholConc = alcoholConc;
    }
}
