package com.ohyes.soolsool.drink.domain;

import com.ohyes.soolsool.user.domain.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
    private LocalDate drinkDate;

    @Column(name = "memo")
    private String memo;

    @Column(name = "img")
    private String img;

    @Column(name = "hangover")
    private String hangover;

    @Column(name = "alcohol_conc")
    private float alcoholConc;

    @Column(name = "detox_time")
    private float detoxTime;

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // 연관 관계
    @OneToMany(mappedBy = "diary")
    private List<Drink> drinks = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "social_id")
    private User user;

    // 생성자
    @Builder
    public Diary(LocalDate drinkDate, String memo, String img, String hangover, float alcoholConc,
        float detoxTime, User user) {
        this.drinkDate = drinkDate;
        this.memo = memo;
        this.img = img;
        this.hangover = hangover;
        this.alcoholConc = alcoholConc;
        this.detoxTime = detoxTime;
        this.user = user;
    }
}
