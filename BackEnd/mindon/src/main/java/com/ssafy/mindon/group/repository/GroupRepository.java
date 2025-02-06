package com.ssafy.mindon.group.repository;

import com.ssafy.mindon.group.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupRepository extends JpaRepository<Group, Integer> {
    boolean existsByInviteCode(String inviteCode);
}
