package ace.ucv.messenger.service;

import ace.ucv.messenger.dto.AddMessageDto;
import ace.ucv.messenger.entity.GroupChat;

import java.security.Principal;
import java.util.List;

public interface GroupChatService {

    GroupChat createGroupChat(String name, String currentUser);

    void addUserToGroupChat(String groupId, String username);

    void removeUserFromGroupChat(String groupId, String username);

    List<GroupChat> findAllGroupChats(String username);

    GroupChat addMessage(Principal principal, AddMessageDto addMessageDto);

    void changeGroupChatName(String groupId, String newName);
}
