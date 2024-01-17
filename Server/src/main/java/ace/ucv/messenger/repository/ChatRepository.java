package ace.ucv.messenger.repository;

import ace.ucv.messenger.entity.Chat;
import ace.ucv.messenger.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatRepository extends MongoRepository<Chat, String> {

    List<Chat> getChatsByFirstUserOrSecondUser(String firstUser, String secondUser);


    Chat findByFirstUserInAndSecondUserIn(List<String> firstUserValues, List<String> secondUserValues);
}
