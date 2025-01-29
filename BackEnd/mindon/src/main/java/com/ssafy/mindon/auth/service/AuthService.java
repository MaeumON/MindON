package com.ssafy.mindon.auth.service;

import com.ssafy.mindon.auth.dto.SignupRequestDto;
import com.ssafy.mindon.common.util.PasswordUtil;
import com.ssafy.mindon.user.entity.User;
import com.ssafy.mindon.user.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    // 회원 가입 비즈니스 로직을 처리
    private final UserRepository userRepository;
    private final PasswordUtil passwordUtil;

    public AuthService(UserRepository userRepository, PasswordUtil passwordUtil) {
        this.userRepository = userRepository;
        this.passwordUtil = passwordUtil;
    }

    public void signup(SignupRequestDto requestDto) {
        // 비밀번호 암호화
        String encodedPassword = passwordUtil.encode(requestDto.getPassword());

        // 사용자 저장
        User user = new User();
        user.setUserId(requestDto.getUserId());  // User ID (userId)
        user.setUserName(requestDto.getUserName());  // User Name (userName)
        user.setEmail(requestDto.getEmail());  // Email
        user.setPhone(requestDto.getPhone());  // Phone
        user.setPassword(encodedPassword);  // 암호화된 비밀번호
        user.setDiseaseId(requestDto.getDiseaseId());  // Disease ID (diseaseId)

        userRepository.save(user);
    }
}
