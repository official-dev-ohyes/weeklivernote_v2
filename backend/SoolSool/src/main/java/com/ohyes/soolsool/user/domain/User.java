package com.ohyes.soolsool.user.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import java.time.LocalDateTime;
import jdk.jfr.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "social_id")
    private Long socialId;

    @OneToOne
    @JoinColumn(name = "category_pk")
    private Category category;

    @Column
    private String nickname;

    @Column(name = "profile_img")
    private String profileImg;

    @Column
    private String address;

    @Column
    private String gender;

    @Column
    private int height;

    @Column
    private int weight;

    @Column(name = "alcohol_limit")
    private int alcoholLimit;

    @Column(name = "refresh_token")
    private String refreshToken;

    @Column(name = "max_nonalcohol_period")
    private int maxNonalcoholPeriod;

    @Column(name = "start_nonalcohol_date")
    private LocalDateTime startNonalcoholDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    @Builder
    public User (Category category, String nickname, String profileImg, String address,
        String gender, int height, int weight, int alcoholLimit, String refreshToken,
        int maxNonalcoholPeriod) {

        this.category =category;
        this.nickname =nickname;
        this.profileImg =profileImg;
        this.address =address;
        this.gender =gender;
        this.height =height;
        this.weight =weight;
        this.alcoholLimit =alcoholLimit;
        this.refreshToken =refreshToken;
        this.maxNonalcoholPeriod =maxNonalcoholPeriod;

    }
}
