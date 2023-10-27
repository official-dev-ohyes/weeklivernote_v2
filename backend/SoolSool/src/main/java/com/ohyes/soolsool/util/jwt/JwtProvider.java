package com.ohyes.soolsool.util.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtProvider {

    private final Key key;
    private static final String AUTHORITIES_KEY = "auth";
    private static final Long ACCESS_EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000L; // 7일
    private static final Long REFRESH_EXPIRATION_TIME = 14 * 24 * 60 * 60 * 1000L; // 14일
//    private final UserRepository userRepository;


    public JwtProvider(@Value("${jwt.secret-key}") String secretKey) {
        String keyBase64Encoded = Base64.getEncoder().encodeToString(secretKey.getBytes());
        this.key = Keys.hmacShaKeyFor(keyBase64Encoded.getBytes());
    }
    public TokenDto createToken(long id) {
        long now = (new Date()).getTime();

        // Access Token 생성
        Date accessTokenExpiresIn = new Date(now + ACCESS_EXPIRATION_TIME);
        String accessToken = Jwts.builder()
            .setSubject(String.valueOf(id)) //payload "sub" : "name"
            .claim(AUTHORITIES_KEY, "ROLE_USER") //payload "auth" : "ROLE_USER"
            .setExpiration(accessTokenExpiresIn) //payload "exp" : 1234567890 (10자리)
            .signWith(this.key, SignatureAlgorithm.HS512) //header "alg" : 해싱 알고리즘 HS512
            .compact();

        // Refresh Token 생성
        String refreshToken = Jwts.builder()
            .setExpiration(new Date(now + REFRESH_EXPIRATION_TIME))
            .signWith(this.key, SignatureAlgorithm.HS512)
            .compact();

        return TokenDto.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .accessTokenExpiresIn(accessTokenExpiresIn.getTime())
            .build();
    }

    public Authentication getAuthentication(String accessToken) {

        Claims claims = parseClaims(accessToken);

        if (claims.get(AUTHORITIES_KEY) == null) {
            throw new RuntimeException("권한 정보가 없는 토큰입니다.");
        }

        Collection<? extends GrantedAuthority> authorities =
            Arrays.stream(claims.get(AUTHORITIES_KEY).toString().split(","))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        UserDetails principal = new User(claims.getSubject(), "", authorities);

        return new UsernamePasswordAuthenticationToken(principal, "", authorities);
    }

    public boolean validateToken(String token) {
        log.info("token : " + token);
        try{
            Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            /* 커스텀 에러처리 */
            log.error("시큐리티 예외 발생");
        } catch (ExpiredJwtException e) {
            /* 커스텀 에러처리 */
            log.error("토큰 만료");

        } catch (UnsupportedJwtException e) {
            /* 커스텀 에러처리 */
            log.error("지원하지 않는 JWT");

        } catch (IllegalArgumentException e) {
            /* 커스텀 에러처리 */
            log.error("단단히 잘못 됐다.");

        }
        return false;
    }

    private Claims parseClaims(String accessToken) {
        try {
            return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(accessToken)
                .getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }
}
