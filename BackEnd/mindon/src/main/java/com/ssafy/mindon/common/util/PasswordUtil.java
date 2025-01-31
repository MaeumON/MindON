package com.ssafy.mindon.common.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PasswordUtil {
    // 비밀번호를 암호화하거나 검증하는 유틸리티 클래스

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public PasswordUtil() {
        this.bCryptPasswordEncoder = new BCryptPasswordEncoder();
    }

    public String encode(String rawPassword) {
        return bCryptPasswordEncoder.encode(rawPassword);
    }

    public boolean matches(String rawPassword, String encodedPassword) {
        return bCryptPasswordEncoder.matches(rawPassword, encodedPassword);
    }
}