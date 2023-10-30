package com.ohyes.soolsool.util.jwt;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TokenDto {
    private String accessToken;
    private String refreshToken;
    private Long accessTokenExpiresIn;
}
