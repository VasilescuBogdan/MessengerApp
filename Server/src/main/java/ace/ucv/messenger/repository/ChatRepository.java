package ace.ucv.messenger.repository;

import ace.ucv.messenger.entity.Chat;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends MongoRepository<Chat, String> {
    @Query("{ '$or':  [ { 'firstUser': :#{#user} }, { 'secondUser': :#{#user} } ] }")
    List<Chat> getChatsOfUser(@Param("user") String user);

    @Query("{ '$and':  [ { 'firstUser': { $in: :#{#participants} } }, { 'secondUser': { $in: :#{#participants} } } ] }")
    Optional<Chat> getChatByParticipants(@Param("participants") List<String> participants);
}
