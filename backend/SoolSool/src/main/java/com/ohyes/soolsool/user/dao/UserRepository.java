package com.ohyes.soolsool.user.dao;

import com.ohyes.soolsool.user.domain.User;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {


}
