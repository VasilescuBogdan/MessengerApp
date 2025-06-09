package ace.ucv.messenger.repository;

import ace.ucv.messenger.entity.GroupChat;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupChatRepository extends MongoRepository<GroupChat, String> {
    List<GroupChat> findAllByUsersContains(String username);
}
