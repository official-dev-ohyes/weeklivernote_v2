package com.ohyes.soolsool.user.dto;

import com.ohyes.soolsool.drink.dto.DrinkInfo;
import jdk.jfr.Category;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserRequestDto {

    private String address;
    private String gender;
    private int height;
    private int weight;
    private String refreshToken;
    private DrinkInfo drinkInfo;



    @Builder
    private UserRequestDto(String address, String gender, int height, int weight,
        String refreshToken, DrinkInfo drinkInfo) {

        this.address = address;
        this.gender = gender;
        this.height = height;
        this.weight = weight;
        this.refreshToken = refreshToken;

        this.drinkInfo = drinkInfo;

    }

}
