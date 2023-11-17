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
public class UserModifyDto {

    @Schema(example = "한소희")
    private String nickname;

    @Schema(example = "부산시 강서구 화전동")
    private String address;

    @Schema(example = "여")
    private String gender;

    @Schema(example = "165")
    private int height;

    @Schema(example = "50")
    private int weight;

    private DrinkInfo drinkInfo;

    @Builder
    private UserModifyDto(String nickname, String address, String gender, int height, int weight,
        DrinkInfo drinkInfo) {

        this.nickname = nickname;
        this.address = address;
        this.gender = gender;
        this.height = height;
        this.weight = weight;

        this.drinkInfo = drinkInfo;

    }
}
