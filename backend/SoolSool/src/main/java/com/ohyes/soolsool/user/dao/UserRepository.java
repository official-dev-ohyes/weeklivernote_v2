package com.ohyes.soolsool.user.dao;

import com.ohyes.soolsool.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    public User findBySocialId(String socialId);
}
