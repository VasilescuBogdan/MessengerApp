package ace.ucv.messenger.service;

import ace.ucv.messenger.dto.AddMessageDto;
import ace.ucv.messenger.entity.Chat;
import ace.ucv.messenger.exceptions.ChatNotFoundException;

import java.security.Principal;
import java.util.List;

public interface ChatService {

    Chat addMessage(AddMessageDto addMessageDto, Principal principal) throws ChatNotFoundException;

    List<Chat> findAllChats(Principal principal);
}
