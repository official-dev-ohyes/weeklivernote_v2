package com.ohyes.soolsool;

import com.ohyes.soolsool.location.dao.LocationRepository;
import com.ohyes.soolsool.location.domain.Location;
import com.ohyes.soolsool.user.dao.UserRepository;
import com.ohyes.soolsool.user.domain.User;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class LocationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Test
    public void addLocationToExistingUsersTest() {
        List<User> users = userRepository.findAll();

        for (User user : users) {
            Location location = new Location();
            locationRepository.save(location);
            user.setLocation(location);
            userRepository.save(user);
        }
    }
}