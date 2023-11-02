package com.ohyes.soolsool.util;

import com.ohyes.soolsool.user.domain.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class UserUtils {
    public static User getUserFromToken(UserDetailsImpl userDetails) {
        User user = userDetails.getUser();
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "[Token] 유효하지 않은 사용자입니다.");
        }
        return user;
    }
}
