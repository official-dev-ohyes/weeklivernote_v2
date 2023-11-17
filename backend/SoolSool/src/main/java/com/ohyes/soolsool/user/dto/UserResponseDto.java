package com.ohyes.soolsool.user.dto;

import com.ohyes.soolsool.drink.dto.DrinkInfo;
import com.ohyes.soolsool.gps.dto.GpsInfo;
import lombok.Builder;
import lombok.Getter;

@Getter
public class UserResponseDto {

    private String nickname;
    private String profileImg;
    private String address;
    private String gender;
    private int height;
    private int weight;
    private float alcoholLimit;
    private DrinkInfo drinkInfo;
    private GpsInfo gpsInfo;

    @Builder
    private UserResponseDto(String nickname, String profileImg,
        String address, String gender, int height, int weight, float alcoholLimit,
        DrinkInfo drinkInfo, GpsInfo gpsInfo) {

        this.nickname = nickname;
        this.profileImg = profileImg;
        this.address = address;
        this.gender = gender;
        this.height = height;
        this.weight = weight;
        this.alcoholLimit = alcoholLimit;
        this.drinkInfo = drinkInfo;
        this.gpsInfo = gpsInfo;
    }
}