package com.ohyes.soolsool.user.dao;

import com.ohyes.soolsool.user.domain.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findBySocialId(Long socialId);
    Optional<User> deleteBySocialId(Long socialId);
}