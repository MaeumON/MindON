package com.ssafy.mindon.group.controller;

import com.ssafy.mindon.group.service.GroupJoinService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/groups")
public class GroupJoinController {

    private final GroupJoinService groupJoinService;

    public GroupJoinController(GroupJoinService groupJoinService) {
        this.groupJoinService = groupJoinService;
    }

    @PostMapping("/{groupId}/members")
    public ResponseEntity<?> joinGroup(
            @RequestHeader(value = "accessToken", required = true) String accessToken,
            @PathVariable Integer groupId
    ) {
        if (accessToken == null || accessToken.isEmpty()) {
            return ResponseEntity.status(400).body("{\"message\": \"Missing accessToken\"}");
        }
        return groupJoinService.joinGroup(accessToken, groupId);
    }

}
