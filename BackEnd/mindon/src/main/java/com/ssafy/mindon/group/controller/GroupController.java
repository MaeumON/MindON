package com.ssafy.mindon.group.controller;

import com.ssafy.mindon.group.dto.CreateGroupRequest;
import com.ssafy.mindon.group.dto.GroupListRequest;
import com.ssafy.mindon.group.dto.GroupListResponse;
import com.ssafy.mindon.group.service.GroupCreateService;
import com.ssafy.mindon.group.service.GroupJoinService;
import com.ssafy.mindon.group.service.GroupListService;
import com.ssafy.mindon.group.service.GroupMyListService;
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

    public GroupController(GroupCreateService groupCreateService, GroupJoinService groupJoinService, GroupListService groupListService, GroupMyListService groupMyListService) {
        this.groupCreateService = groupCreateService;
        this.groupJoinService = groupJoinService;
        this.groupListService = groupListService;
        this.groupMyListService = groupMyListService;
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
}
