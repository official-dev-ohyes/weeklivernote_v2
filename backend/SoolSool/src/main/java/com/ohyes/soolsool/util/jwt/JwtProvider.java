package com.ohyes.soolsool.util.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.ohyes.soolsool.user.dao.UserRepository;
import com.ohyes.soolsool.user.domain.User;
import com.ohyes.soolsool.util.UserDetailsImpl;
import java.util.Date;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtProvider {

    @Value("${jwt.secret-key}")
    private String SECRET_KEY;

    private static final Long ACCESS_EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000L; // 7일
    private static final Long REFRESH_EXPIRATION_TIME = 14 * 24 * 60 * 60 * 1000L; // 14일

    private final UserRepository userRepository;

    public TokenDto createToken(User user) {
        // AccessToken 생성
        String accessToken = JWT.create()
            .withSubject(user.getNickname() + "JWTToken")
            .withExpiresAt(new Date(System.currentTimeMillis() + ACCESS_EXPIRATION_TIME))
            .withClaim("socialId", user.getSocialId())
            .sign(Algorithm.HMAC512(SECRET_KEY));

        // RefreshToken 생성
        String refreshToken = JWT.create()
            .withSubject(user.getNickname() + "JWTToken")
            .withExpiresAt(new Date(System.currentTimeMillis() + REFRESH_EXPIRATION_TIME))
            .withClaim("socialId", user.getSocialId())
            .sign(Algorithm.HMAC512(SECRET_KEY));

        log.info("[User] 로그인 성공");

        return TokenDto.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .accessTokenExpiresIn(REFRESH_EXPIRATION_TIME)
            .build();
    }

    public Authentication authenticateToken(String token) {
        try {
            String socialId = String.valueOf(JWT.require(Algorithm.HMAC512(SECRET_KEY)).build().verify(token)
                .getClaim("socialId"));

            if (socialId != null) {
                User user = userRepository.findById(socialId).orElseThrow(
                    () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "[User] 가입하지 않은 사용자입니다.")
                );
                UserDetailsImpl userDetails = new UserDetailsImpl(user);
                return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            } else {
                throw new UsernameNotFoundException("사용자를 찾을 수 없음");
            }
        } catch (JWTDecodeException e) {
            throw new AuthenticationException("[Token] 유효하지 않은 토큰입니다.") {};
        }
    }
}
