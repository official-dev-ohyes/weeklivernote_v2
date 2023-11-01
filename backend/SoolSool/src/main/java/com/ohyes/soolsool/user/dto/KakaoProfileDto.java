package com.ohyes.soolsool.user.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;


@Getter
@AllArgsConstructor
public class KakaoProfileDto {

    private Long socialId;

    private String nickname;

    private String profileImg;


}
