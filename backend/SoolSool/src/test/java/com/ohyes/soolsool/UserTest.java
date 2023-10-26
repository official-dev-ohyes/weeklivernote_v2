package com.ohyes.soolsool;

import com.ohyes.soolsool.user.dao.UserRepository;
import com.ohyes.soolsool.user.domain.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class UserTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void setDefaultUserToDB() {

        userRepository.deleteAllInBatch();

        User user = User.builder()
            .socialId(1L)
            .nickname("스끼다시")
            .address("삼성전기")
            .gender("여")
            .height(158)
            .weight(48)
            .alcoholLimit(8.2F)
            .maxNonalcoholPeriod(12)
            .build();
        userRepository.save(user);
    }
}
