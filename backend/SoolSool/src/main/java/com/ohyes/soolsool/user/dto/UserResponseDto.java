package com.ohyes.soolsool.user.dto;

import jdk.jfr.Category;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserResponseDto {

    private Long socialId;
    private Category category;
    private String nickname;
    private String profileImg;
    private String address;
    private String gender;
    private int height;
    private int weight;
    private float alcoholLimit;
    private String refreshToken;
    private int maxNonalcoholPeriod;


    @Builder
    private UserResponseDto(Long socialId, Category category, String nickname, String profileImg,
        String address,
        String gender, int height, int weight, float alcoholLimit, String refreshToken,
        int maxNonalcoholPeriod) {

        this.socialId = socialId;
        this.category = category;
        this.nickname = nickname;
        this.profileImg = profileImg;
        this.address = address;
        this.gender = gender;
        this.height = height;
        this.weight = weight;
        this.alcoholLimit = alcoholLimit;
        this.refreshToken = refreshToken;
        this.maxNonalcoholPeriod = maxNonalcoholPeriod;
    }
}
