package com.ssafy.mindon.user.repository;

import com.ssafy.mindon.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    // 회원 데이터를 저장하거나 조회하는 JPA Repository
}
