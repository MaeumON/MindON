package com.ssafy.mindon.group.controller;

import com.ssafy.mindon.common.error.ErrorCode;
import com.ssafy.mindon.common.exception.GroupException;
import com.ssafy.mindon.common.util.JwtUtil;
import com.ssafy.mindon.group.dto.*;
import com.ssafy.mindon.group.service.*;
import com.ssafy.mindon.userreview.dto.GroupReviewResponseDto;
import com.ssafy.mindon.userreview.service.GroupReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

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
            @RequestBody @Valid CreateGroupRequestDto request) {

        jwtUtil.validateToken(accessToken);  // 토큰 검증
        boolean isCreated = groupCreateService.createGroup(accessToken, request);
        if (isCreated) {
            return ResponseEntity.status(201).body("{\"message\": \"success\"}");
        } else {
            throw new GroupException(ErrorCode.GROUP_CREATION_FAILED);
        }

    }

    @PostMapping("/{groupId}/members")
    public ResponseEntity<String> joinGroup(
            @RequestHeader("Authorization") String accessToken,
            @PathVariable Integer groupId) {

        jwtUtil.validateToken(accessToken);
        groupJoinService.joinGroup(accessToken, groupId);
        return ResponseEntity.ok("{\"message\": \"success\"}");
    }

    @PostMapping("/list")
    public ResponseEntity<?> getGroupList(
            @RequestHeader("Authorization") String accessToken,
            @RequestBody GroupListRequestDto request,
            Pageable pageable) {

        jwtUtil.validateToken(accessToken);
        Page<GroupListResponseDto> response = groupListService.findGroupsByCriteria(
                request.getKeyword(), request.getDiseaseId(), request.getIsHost(),
                request.getStartDate(), request.getPeriod(), request.getStartTime(),
                request.getEndTime(), request.getDayOfWeek(), pageable
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{groupStatus}/list")
    public ResponseEntity<List<GroupListResponseDto>> getGroupsByStatus(
            @RequestHeader("Authorization") String accessToken,
            @PathVariable Byte groupStatus,
            @RequestBody(required = false) GroupListRequestDto request
    ) {
        jwtUtil.validateToken(accessToken);
        String keyword = (request != null) ? request.getKeyword() : null;

        List<GroupListResponseDto> groupList = groupListService.findGroupsByAccessTokenAndStatus(accessToken, groupStatus, keyword);
        return ResponseEntity.ok(groupList);
    }

    // 그룹 탈퇴
    @DeleteMapping("/{groupId}/members")
    public ResponseEntity<String> leaveGroup(
            @RequestHeader("Authorization") String accessToken,
            @PathVariable Integer groupId) {

        jwtUtil.validateToken(accessToken);
        groupLeaveService.leaveGroup(groupId, accessToken);
        return ResponseEntity.ok("{\"message\": \"탈퇴 완료\"}");
    }


    @GetMapping("/{groupId}")
    public ResponseEntity<GroupDetailResponseDto> getGroupDetail(
            @RequestHeader("Authorization") String accessToken,
            @PathVariable Integer groupId) {

        jwtUtil.validateToken(accessToken);
        GroupDetailResponseDto response = groupDetailService.findGroupDetailById(accessToken, groupId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{diseaseId}/new")
    public ResponseEntity<?> getRecommendedGroups(
            @RequestHeader("Authorization") String accessToken,
            @PathVariable Byte diseaseId) {

        jwtUtil.validateToken(accessToken);
        List<GroupListResponseDto> response = groupRecommendService.getRecommendedGroups(diseaseId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{groupId}/reviews")
    public ResponseEntity<GroupReviewResponseDto> getGroupReviews(
            @RequestHeader("Authorization") String accessToken,
            @PathVariable Integer groupId) {

        jwtUtil.validateToken(accessToken);
        return ResponseEntity.ok(groupReviewService.getGroupReviews(accessToken, groupId));
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Integer>> getUserGroupStatusCount(@RequestHeader(HttpHeaders.AUTHORIZATION) String accessToken) {

        jwtUtil.validateToken(accessToken);
        String userId = jwtUtil.extractUserId(accessToken);

        Map<String, Integer> result = groupService.getUserGroupStatusCount(userId);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/password")
    public ResponseEntity<Boolean> checkGroupPassword(@RequestBody GroupPasswordRequestDto request) {
        System.out.println(request.getGroupId() + "con" + request.getPrivatePassword());
        boolean isCorrect = groupService.checkGroupPassword(request.getGroupId(), request.getPrivatePassword());
        return ResponseEntity.ok(isCorrect);
    }
}
