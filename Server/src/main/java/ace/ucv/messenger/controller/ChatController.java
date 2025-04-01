package ace.ucv.messenger.controller;

import ace.ucv.messenger.dto.AddMessageDto;
import ace.ucv.messenger.entity.Chat;
import ace.ucv.messenger.exceptions.ChatNotFoundException;
import ace.ucv.messenger.service.ChatService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@PreAuthorize("isAuthenticated()")
public class ChatController {

    private final ChatService chatService;

    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/addMessage")
    @SecurityRequirement(name = "Bearer Authentication")
    public Chat addMessage(@RequestBody AddMessageDto addMessageDto, Principal principal) throws ChatNotFoundException {
        return chatService.addMessage(addMessageDto, principal);
    }

    @GetMapping()
    @ResponseStatus(HttpStatus.OK)
    @SecurityRequirement(name = "Bearer Authentication")
    public List<Chat> getAllChats(Principal principal) {
        return chatService.findAllChats(principal);
    }
}
