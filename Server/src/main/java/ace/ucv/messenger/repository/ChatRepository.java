package ace.ucv.messenger.repository;

import ace.ucv.messenger.entity.Chat;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends MongoRepository<Chat, String> {

    List<Chat> getChatsByFirstUserOrSecondUser(String firstUser, String secondUser);


    Chat findByFirstUserInAndSecondUserIn(List<String> firstUserValues, List<String> secondUserValues);
}
