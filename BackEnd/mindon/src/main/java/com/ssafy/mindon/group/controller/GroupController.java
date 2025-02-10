package com.ssafy.mindon.group.controller;

import com.ssafy.mindon.group.dto.CreateGroupRequest;
import com.ssafy.mindon.group.dto.GroupDetailResponse;
import com.ssafy.mindon.group.dto.GroupListRequest;
import com.ssafy.mindon.group.dto.GroupListResponse;
import com.ssafy.mindon.group.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    private final GroupCreateService groupCreateService;
    private final GroupJoinService groupJoinService;
    private final GroupListService groupListService;
    private final GroupMyListService groupMyListService;
    private final GroupLeaveService groupLeaveService;
    private final GroupDetailService groupDetailService;
    private final GroupRecommendService groupRecommendService;

    public GroupController(GroupCreateService groupCreateService, GroupJoinService groupJoinService, GroupListService groupListService, GroupMyListService groupMyListService, GroupLeaveService groupLeaveService, GroupDetailService groupDetailService, GroupRecommendService groupRecommendService) {
        this.groupCreateService = groupCreateService;
        this.groupJoinService = groupJoinService;
        this.groupListService = groupListService;
        this.groupMyListService = groupMyListService;
        this.groupLeaveService = groupLeaveService;
        this.groupDetailService = groupDetailService;
        this.groupRecommendService = groupRecommendService;
    }

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
            return ResponseEntity.status(400).body("{\"message\": \"Missing accessToken\"}");
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

        return ResponseEntity.ok(Collections.singletonMap("data", response));
    }

    @PostMapping("/{groupStatus}/list")
    public ResponseEntity<List<GroupListResponse>> getGroupsByStatus(
            @RequestHeader("Authorization") String accessToken,
            @PathVariable Byte groupStatus
    ) {
        List<GroupListResponse> groupList = groupMyListService.findGroupsByAccessTokenAndStatus(accessToken, groupStatus);

        return ResponseEntity.ok(groupList);
    }
    // 그룹 탈퇴
    @DeleteMapping("/{groupId}/members")
    public ResponseEntity<String> leaveGroup(
            @RequestHeader("Authorization") String accessToken,
            @PathVariable Integer groupId) {

        if (accessToken == null || accessToken.isEmpty()) {
            return ResponseEntity.status(400).body("{\"message\": \"Missing accessToken\"}");
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
            return ResponseEntity.status(400).body(null);
        }

        GroupDetailResponse response = groupDetailService.findGroupDetailById(accessToken, groupId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{diseaseId}/new")
    public ResponseEntity<?> getRecommendedGroups(
            @RequestHeader("Authorization") String accessToken,
            @PathVariable Byte diseaseId) {

        if (accessToken == null || accessToken.isEmpty()) {
            return ResponseEntity.status(400).body("{\"message\": \"Missing accessToken\"}");
        }

        List<GroupListResponse> response = groupRecommendService.getRecommendedGroups(diseaseId);
        return ResponseEntity.ok(Collections.singletonMap("data", response));
    }
}
