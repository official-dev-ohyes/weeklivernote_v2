package com.ohyes.soolsool.user.dto;

import jdk.jfr.Category;
import lombok.Builder;
import lombok.Getter;

@Getter
public class UserRequestDto {

    private Long socialId;
//    private Category category;
    private String nickname;
    private String profileImg;
    private String address;
    private String gender;
    private int height;
    private int weight;
    private int alcoholLimit;
    private String refreshToken;
    private int maxNonalcoholPeriod;

    @Builder
    private UserRequestDto(Long socialId, String nickname, String profileImg,
        String address,
        String gender, int height, int weight, int alcoholLimit, String refreshToken,
        int maxNonalcoholPeriod) {

        this.socialId = socialId;
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
