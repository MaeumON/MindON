package com.ssafy.mindon.auth.service;

import com.ssafy.mindon.auth.dto.LoginRequestDto;
import com.ssafy.mindon.auth.dto.SignupRequestDto;
import com.ssafy.mindon.common.error.ErrorCode;
import com.ssafy.mindon.common.exception.AuthException;
import com.ssafy.mindon.common.util.JwtUtil;
import com.ssafy.mindon.common.util.PasswordUtil;
import com.ssafy.mindon.disease.entity.Disease;
import com.ssafy.mindon.user.entity.User;
import com.ssafy.mindon.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordUtil passwordUtil;
    private final JwtUtil jwtUtil;
    private final RedisTemplate<String, String> redisTemplate;

    // 회원 가입
    public void signup(SignupRequestDto requestDto) {
        // 비밀번호 암호화
        String encodedPassword = passwordUtil.encode(requestDto.getPassword());

        // 사용자 저장
        User user = new User();
        user.setUserId(requestDto.getUserId());
        user.setUserName(requestDto.getUserName());
        user.setPhone(requestDto.getPhone());
        user.setPassword(encodedPassword);
        user.setDiseaseId(requestDto.getDiseaseId());

        userRepository.save(user);
    }

    // 로그인
    public Map<String, Object> login(LoginRequestDto loginRequestDto) {
        // userId로 사용자 조회
        User user = userRepository.findByUserId(loginRequestDto.getUserId());

        if (user == null) {
            throw new AuthException(ErrorCode.USER_NOT_FOUND);
        }

        // 비밀번호 검증
        if (!passwordUtil.matches(loginRequestDto.getPassword(), user.getPassword())) {
            throw new AuthException(ErrorCode.INVALID_PASSWORD);
        }

        if (user.getUserStatus() == 2 || user.getUserStatus() == 1) { // 정지된 계정이나 탈퇴한 계정이면 에러 반환
            throw new AuthException(ErrorCode.ACCOUNT_SUSPENDED);
        }

        // 유저 정보 저장
        String userId = user.getUserId();
        String userName = user.getUserName();
        int diseaseId = user.getDiseaseId();
        String diseaseName = user.getDisease().getDiseaseName();

        // JWT 토큰 생성
        String accessToken = jwtUtil.generateAccessToken(user.getUserId());
        String refreshToken = jwtUtil.generateRefreshToken(user.getUserId());

        // 리프레시 토큰 Redis에 저장 (7일 만료)
        redisTemplate.opsForValue().set(user.getUserId(), refreshToken, 7, TimeUnit.DAYS);

        // 토큰 반환
        Map<String, Object> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);
        tokens.put("userId", userId);
        tokens.put("userName", userName);
        tokens.put("diseaseId", diseaseId);
        tokens.put("diseaseName", diseaseName);
        return tokens;
    }

    // 로그아웃
    public void logout(String userId) {
        // Redis에서 리프레시 토큰 삭제
        redisTemplate.delete(userId);
    }

    // 리프레시 토큰 검증 및 재발급
    public Map<String, String> refresh(String userId, String refreshToken) {
        // Redis에서 저장된 리프레시 토큰 가져오기
        String storedToken = redisTemplate.opsForValue().get(userId);

        if (storedToken == null || !storedToken.equals(refreshToken)) {
            throw new AuthException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

        // 새 토큰 생성
        String newAccessToken = jwtUtil.generateAccessToken(userId);
        String newRefreshToken = jwtUtil.generateRefreshToken(userId);

        // Redis 갱신
        redisTemplate.opsForValue().set(userId, newRefreshToken, 7, TimeUnit.DAYS);

        // 새 토큰 반환
        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", newAccessToken);
        tokens.put("refreshToken", newRefreshToken);
        return tokens;
    }

    public String findUserId(String userName, String phone) {
        return userRepository.findByUserNameAndPhone(userName, phone)
                .map(user -> {
                    if (user.getUserStatus() == 2 || user.getUserStatus() == 1) { // 정지된 계정이나 탈퇴한 계정이면 에러 반환
                        throw new AuthException(ErrorCode.ACCOUNT_SUSPENDED);
                    }
                    return user.getUserId();
                })
                .orElseThrow(() -> new AuthException(ErrorCode.USER_NOT_FOUND));
    }

    public boolean isUserExists(String userId, String phone) {
        return userRepository.findByUserIdAndPhone(userId, phone)
                .map(user -> {
                    if (user.getUserStatus() == 2 || user.getUserStatus() == 1) { // 정지된 계정이나 탈퇴한 계정이면 에러 반환
                        throw new AuthException(ErrorCode.ACCOUNT_SUSPENDED);
                    }
                    return true;
                })
                .orElse(false);
    }

    // 비밀번호 재설정
    public void resetPassword(String userId, String newPassword) {
        // userId로 사용자 조회
        User user = userRepository.findByUserId(userId);

        if (user == null) {
            throw new AuthException(ErrorCode.USER_NOT_FOUND); // 사용자가 존재하지 않으면 예외 발생
        }

        // 새 비밀번호 암호화
        String encodedPassword = passwordUtil.encode(newPassword);

        // 비밀번호 업데이트
        user.setPassword(encodedPassword);
        userRepository.save(user);
    }

    public boolean isIdAvailable(String userId) {
        User user = userRepository.findByUserId(userId);
        if (user == null) return true;
        else return false;
    }
}
