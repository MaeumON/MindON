package com.ssafy.mindon.group.controller;

import com.ssafy.mindon.group.dto.CreateGroupRequest;
import com.ssafy.mindon.group.service.GroupCreateService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/groups")
public class GroupCreateController {

    private final GroupCreateService groupCreateService;

    public GroupCreateController(GroupCreateService groupCreateService) {
        this.groupCreateService = groupCreateService;
    }

    @PostMapping
    public ResponseEntity<?> createGroup(
            @RequestHeader("Authorization") String accessToken,
            @RequestBody @Valid CreateGroupRequest request) {

        boolean isCreated = groupCreateService.createGroup(accessToken, request);
        if (isCreated) {
            return ResponseEntity.status(201).body("{\"message\": \"success\"}");
        } else {
            System.out.println("GroupCreateController.createGroup");
            return ResponseEntity.badRequest().body("{\"message\": \"fail\"}");
        }
    }
}
