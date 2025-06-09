package ace.ucv.messenger.controller;

import ace.ucv.messenger.dto.AddMessageDto;
import ace.ucv.messenger.entity.GroupChat;
import ace.ucv.messenger.service.GroupChatService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/groupChat")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@PreAuthorize("isAuthenticated()")
@SecurityRequirement(name = "Bearer Authentication")
public class GroupChatController {

    private final GroupChatService groupChatService;

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping()
    public GroupChat createGroupChat(@RequestParam("name") String groupName, Principal principal) {
        return groupChatService.createGroupChat(groupName, principal.getName());
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/addUser/{groupId}")
    public void addUserToGroupChat(@PathVariable("groupId") String groupId, @RequestParam("user") String username) {
        groupChatService.addUserToGroupChat(groupId, username);
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/removeUser/{groupId}")
    public void removeUserFromGroupChat(@PathVariable("groupId") String groupId, @RequestParam("user") String username) {
        groupChatService.removeUserFromGroupChat(groupId, username);
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping()
    public List<GroupChat> findAllGroupChats(Principal principal) {
        return groupChatService.findAllGroupChats(principal.getName());
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/addMessage")
    public GroupChat addMessage(Principal principal, @RequestBody AddMessageDto addMessageDto) {
        return groupChatService.addMessage(principal, addMessageDto);
    }
}
