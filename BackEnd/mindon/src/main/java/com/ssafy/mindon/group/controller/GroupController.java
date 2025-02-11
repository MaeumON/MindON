package com.ssafy.mindon.group.controller;

import com.ssafy.mindon.common.error.ErrorCode;
import com.ssafy.mindon.common.exception.AuthException;
import com.ssafy.mindon.common.util.JwtUtil;
import com.ssafy.mindon.group.dto.CreateGroupRequest;
import com.ssafy.mindon.group.dto.GroupDetailResponse;
import com.ssafy.mindon.group.dto.GroupListRequest;
import com.ssafy.mindon.group.dto.GroupListResponse;
import com.ssafy.mindon.group.service.*;
import com.ssafy.mindon.userreview.dto.GroupReviewResponse;
import com.ssafy.mindon.userreview.service.GroupReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.Collections;
import java.util.List;
import java.util.Map;
@Slf4j
@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupCreateService groupCreateService;
    private final GroupJoinService groupJoinService;
    private final GroupListService groupListService;
    private final GroupLeaveService groupLeaveService;
    private final GroupDetailService groupDetailService;
    private final GroupRecommendService groupRecommendService;
    private final GroupReviewService groupReviewService;
    private final JwtUtil jwtUtil;
    private final GroupService groupService;

    @PostMapping
    public ResponseEntity<String> createGroup(
            @RequestHeader("Authorization") String accessToken,
            @RequestBody @Valid CreateGroupRequest request) {

        boolean isCreated = groupCreateService.createGroup(accessToken, request);
        if (isCreated) {
            return ResponseEntity.status(201).body("{\"message\": \"success\"}");
        } else {
            return ResponseEntity.badRequest().body("{\"message\": \"fail\"}");
        }
    }

    @PostMapping("/{groupId}/members")
    public ResponseEntity<String> joinGroup(
            @RequestHeader("Authorization") String accessToken,
            @PathVariable Integer groupId) {

        if (accessToken == null || accessToken.isEmpty()) {
            return ResponseEntity.status(401).body("{\"message\": \"Missing accessToken\"}");
        }
        return groupJoinService.joinGroup(accessToken, groupId);
    }

    @PostMapping("/list")
    public ResponseEntity<?> getGroupList(@RequestBody GroupListRequest request) {
        List<GroupListResponse> response = groupListService.findGroupsByCriteria(
                request.getKeyword(), request.getDiseaseId(), request.getIsHost(),
                request.getStartDate(), request.getPeriod(), request.getStartTime(),
                request.getEndTime(), request.getDayOfWeek()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{groupStatus}/list")
    public ResponseEntity<List<GroupListResponse>> getGroupsByStatus(
            @RequestHeader("Authorization") String accessToken,
            @PathVariable Byte groupStatus,
            @RequestBody GroupListRequest request
    ) {
        String keyword = request != null ? request.getKeyword() : null;

        List<GroupListResponse> groupList = groupListService.findGroupsByAccessTokenAndStatus(accessToken, groupStatus, keyword);

        return ResponseEntity.ok(groupList);
    }
    // 그룹 탈퇴
    @DeleteMapping("/{groupId}/members")
    public ResponseEntity<String> leaveGroup(
            @RequestHeader("Authorization") String accessToken,
            @PathVariable Integer groupId) {

        if (accessToken == null || accessToken.isEmpty()) {
            return ResponseEntity.status(401).body("{\"message\": \"Missing accessToken\"}");
        }

        boolean isLeft = groupLeaveService.leaveGroup(groupId, accessToken);

        if (isLeft) {
            return ResponseEntity.ok("{\"message\": \"탈퇴 완료\"}");
        } else {
            return ResponseEntity.status(400).body("{\"message\": \"탈퇴 실패\"}");
        }
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<GroupDetailResponse> getGroupDetail(
            @RequestHeader("Authorization") String accessToken,
            @PathVariable Integer groupId) {

        if (accessToken == null || accessToken.isEmpty()) {
            return ResponseEntity.status(401).body(null);
        }

        GroupDetailResponse response = groupDetailService.findGroupDetailById(accessToken, groupId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{diseaseId}/new")
    public ResponseEntity<?> getRecommendedGroups(
            @RequestHeader("Authorization") String accessToken,
            @PathVariable Byte diseaseId) {

        if (accessToken == null || accessToken.isEmpty()) {
            return ResponseEntity.status(401).body("{\"message\": \"Missing accessToken\"}");
        }

        List<GroupListResponse> response = groupRecommendService.getRecommendedGroups(diseaseId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{groupId}/reviews")
    public ResponseEntity<GroupReviewResponse> getGroupReviews(
            @RequestHeader("Authorization") String accessToken,
            @PathVariable Integer groupId) {
        return ResponseEntity.ok(groupReviewService.getGroupReviews(accessToken, groupId));
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Integer>> getUserGroupStatusCount(@RequestHeader(HttpHeaders.AUTHORIZATION) String accessToken){
        try {
            if (jwtUtil.isTokenExpired(accessToken)) {
                throw new AuthException(ErrorCode.EXPIRED_ACCESS_TOKEN);
            }
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            throw new AuthException(ErrorCode.EXPIRED_ACCESS_TOKEN); // 원하는 예외 던지기
        }
        String userId = jwtUtil.extractUserId(accessToken);

        Map<String, Integer> result = groupService.getUserGroupStatusCount(userId);
        return ResponseEntity.ok(result);
    }
}
