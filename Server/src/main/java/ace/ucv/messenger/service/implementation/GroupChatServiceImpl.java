package ace.ucv.messenger.service.implementation;

import ace.ucv.messenger.dto.AddMessageDto;
import ace.ucv.messenger.dto.Notification;
import ace.ucv.messenger.entity.GroupChat;
import ace.ucv.messenger.entity.Message;
import ace.ucv.messenger.repository.GroupChatRepository;
import ace.ucv.messenger.service.GroupChatService;
import ace.ucv.messenger.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupChatServiceImpl implements GroupChatService {
    private static final String GROUP_CHAT_NOT_FOUND_MESSAGE = "Group chat not found";
    private final GroupChatRepository groupChatRepository;
    private final NotificationService notificationService;

    @Override
    public GroupChat createGroupChat(String name, String currentUser) {
        return groupChatRepository.save(GroupChat.builder()
                .name(name)
                .users(new ArrayList<>(List.of(currentUser)))
                .messages(new ArrayList<>())
                .build());
    }

    @Override
    public void addUserToGroupChat(String groupId, String username) {
        GroupChat groupChat = groupChatRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException(GROUP_CHAT_NOT_FOUND_MESSAGE));
        groupChat.getUsers().add(username);
        groupChatRepository.save(groupChat);
    }

    @Override
    public void removeUserFromGroupChat(String groupId, String username) {
        GroupChat groupChat = groupChatRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException(GROUP_CHAT_NOT_FOUND_MESSAGE));
        groupChat.getUsers().remove(username);
        groupChatRepository.save(groupChat);
    }

    @Override
    public List<GroupChat> findAllGroupChats(String username) {
        return groupChatRepository.findAllByUsersContains(username);
    }

    @Override
    public GroupChat addMessage(Principal principal, AddMessageDto addMessageDto) {
        GroupChat groupChat = groupChatRepository.findById(addMessageDto.recipient())
                .orElseThrow(() -> new IllegalArgumentException(GROUP_CHAT_NOT_FOUND_MESSAGE));
        Message message = Message.builder()
                .content(addMessageDto.content())
                .sender(principal.getName())
                .date(LocalDate.now())
                .time(LocalTime.now())
                .build();
        groupChat.getMessages().add(message);
        Notification notification = Notification.builder()
                .chatId(groupChat.getId())
                .message(message)
                .build();
        for (String user : groupChat.getUsers()) {
            notificationService.sendNotification(user, notification);
        }
        return groupChatRepository.save(groupChat);
    }

    @Override
    public void changeGroupChatName(String groupId, String newName) {
        GroupChat groupChat = groupChatRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException(GROUP_CHAT_NOT_FOUND_MESSAGE));
        groupChat.setName(newName);
        groupChatRepository.save(groupChat);
    }
}
