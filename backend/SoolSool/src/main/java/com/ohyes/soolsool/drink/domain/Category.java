package com.ohyes.soolsool.drink.domain;

import com.ohyes.soolsool.user.domain.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@Entity
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_pk")
    private byte categoryPk;

    @Column(name = "category_name")
    private String categoryName;

    @Column(name = "volume")
    private float volume;

    @Column(name = "glass")
    private int glass;

    @Column(name = "bottle")
    private int bottle;

    // 연관 관계
    @OneToMany(mappedBy = "category")
    private List<Drink> drinks = new ArrayList<>();

    @OneToMany(mappedBy = "category")
    private List<User> users = new ArrayList<>();

    // 생성자
    @Builder
    public Category(String categoryName, float volume, int glass, int bottle) {
        this.categoryName = categoryName;
        this.volume = volume;
        this.glass = glass;
        this.bottle = bottle;
    }
}
