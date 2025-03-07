package com.ssafy.mindon.user.repository;

import com.ssafy.mindon.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    // 회원 데이터를 저장하거나 조회하는 JPA Repository
    User findByUserId(String userId);
    Optional<User> findByUserNameAndPhone(String userName, String phone);

    Optional<User> findByUserIdAndPhone(String userId, String phone);
    List<User> findByUserStatus(Byte userStatus);
}
