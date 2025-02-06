package com.ssafy.mindon.usergroup.entity;

import java.io.Serializable;
import java.util.Objects;

public class UserGroupId implements Serializable {
    private String user;  // User의 user_id (VARCHAR)
    private Integer group; // Group의 group_id (INT)

    public UserGroupId() {}

    public UserGroupId(String user, Integer group) {
        this.user = user;
        this.group = group;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserGroupId that = (UserGroupId) o;
        return Objects.equals(user, that.user) && Objects.equals(group, that.group);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user, group);
    }
}
