package ace.ucv.messenger.service.implementation;

import ace.ucv.messenger.entity.Chat;
import ace.ucv.messenger.entity.Message;
import ace.ucv.messenger.entity.User;
import ace.ucv.messenger.exceptions.ChatNotFoundException;
import ace.ucv.messenger.exceptions.UserNotFoundException;
import ace.ucv.messenger.repository.ChatRepository;
import ace.ucv.messenger.repository.UserRepository;
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
    private final UserRepository userRepository;

    @Override
    public void addChat(String firstUser, String secondUser) {
        Chat chat = new Chat();
        chat.setMessages(new ArrayList<>());
        chat.setFirstUser(firstUser);
        chat.setSecondUser(secondUser);
        chatRepository.save(chat);
    }

    @Override
    public List<Message> addMessage(String newMessageContent, String recipient, Principal principal) {
        String username = principal.getName();
        List<String> listUsers = new ArrayList<>();
        listUsers.add(recipient);
        listUsers.add(username);
        Chat chat = chatRepository.findByFirstUserInAndSecondUserIn(listUsers, listUsers);

        User currentUser = userRepository.findUserByUsername(principal.getName()).orElseThrow(() -> new UserNotFoundException("User not found"));

        List<Message> messages = chat.getMessages();

        Message message = new Message();
        message.setContent(newMessageContent);
        message.setTime(LocalTime.now());
        message.setDate(LocalDate.now());
        message.setSenderUsername(currentUser.getUsername());
        messages.add(message);
        chat.setMessages(messages);
        chatRepository.save(chat);
        return messages;
    }

    @Override
    public List<Chat> findAllChats(Principal principal) {
        return chatRepository.getChatsByFirstUserOrSecondUser(principal.getName(), principal.getName());
    }

}
