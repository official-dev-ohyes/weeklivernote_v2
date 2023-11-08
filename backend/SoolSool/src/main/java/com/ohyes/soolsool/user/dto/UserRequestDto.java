package com.ohyes.soolsool.user.dto;

import com.ohyes.soolsool.drink.dto.DrinkInfo;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserRequestDto {

    @Schema(example = "1234567890")
    private String socialId;

    @Schema(example = "부산시 강서구 화전동")
    private String address;

    @Schema(example = "여")
    private String gender;

    @Schema(example = "165")
    private int height;

    @Schema(example = "50")
    private int weight;

    private String refreshToken;

    private DrinkInfo drinkInfo;

    @Builder
    private UserRequestDto(String socialID, String address, String gender, int height, int weight,
        String refreshToken, DrinkInfo drinkInfo) {

        this.socialId = socialID;
        this.address = address;
        this.gender = gender;
        this.height = height;
        this.weight = weight;
        this.refreshToken = refreshToken;

        this.drinkInfo = drinkInfo;

    }

}
