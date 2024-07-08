package ace.ucv.messenger.service.implementation;

import ace.ucv.messenger.entity.Chat;
import ace.ucv.messenger.entity.Message;
import ace.ucv.messenger.exceptions.ChatNotFoundException;
import ace.ucv.messenger.repository.ChatRepository;
import ace.ucv.messenger.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatRepository chatRepository;

    @Override
    public void addChat(String firstUser, String secondUser) {
        Chat chat = new Chat();
        chat.setMessages(new ArrayList<>());
        chat.setFirstUser(firstUser);
        chat.setSecondUser(secondUser);
        chatRepository.save(chat);
    }

    @Override
    public List<Message> addMessage(String messageContent, String recipient, Principal principal) {
        String username = principal.getName();
        Chat chat = getChat(recipient, username);
        Message newMessage = Message.builder()
                                    .content(messageContent)
                                    .date(LocalDate.now())
                                    .time(LocalTime.now())
                                    .senderUsername(username)
                                    .build();
        List<Message> messages = chat.getMessages();
        messages.add(newMessage);
        chat.setMessages(messages);
        chatRepository.save(chat);
        return messages;
    }

    @Override
    public List<Chat> findAllChats(Principal principal) {
        return chatRepository.getChatsOfUser(principal.getName());
    }

    private Chat getChat(String firstUser, String secondUser) {
        List<String> listUsers = new ArrayList<>();
        listUsers.add(firstUser);
        listUsers.add(secondUser);
        return chatRepository.getChatByParticipants(listUsers)
                             .orElseThrow(ChatNotFoundException::new);
    }

}
