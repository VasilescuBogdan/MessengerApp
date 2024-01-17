package ace.ucv.messenger.service;

import ace.ucv.messenger.entity.Chat;
import ace.ucv.messenger.entity.Message;
import ace.ucv.messenger.exceptions.ChatAlreadyExistException;
import ace.ucv.messenger.exceptions.ChatNotFoundException;

import java.security.Principal;
import java.util.List;

public interface ChatService {

    void addChat(String firstUser, String secondUser) throws ChatAlreadyExistException;

    List<Message> addMessage(String newMessageContent, String recipient, Principal principal) throws ChatNotFoundException;

    List<Chat> findAllChats(Principal principal);
}
