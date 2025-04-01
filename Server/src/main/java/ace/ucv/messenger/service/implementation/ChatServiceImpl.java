package ace.ucv.messenger.service.implementation;

import ace.ucv.messenger.dto.AddMessageDto;
import ace.ucv.messenger.entity.Chat;
import ace.ucv.messenger.entity.Message;
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
    public Chat addMessage(AddMessageDto addMessageDto, Principal principal) {
        String username = principal.getName();
        String recipient = addMessageDto.recipient();
        String messageContent = addMessageDto.content();
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
        return chatRepository.save(chat);
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
                             .orElse(new Chat(null, firstUser, secondUser, new ArrayList<>()));
    }

}
