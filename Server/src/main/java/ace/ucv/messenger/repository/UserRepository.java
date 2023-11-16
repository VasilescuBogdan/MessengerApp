package ace.ucv.messenger.repository;

import ace.ucv.messenger.entity.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, ObjectId> {
     Optional<User> findUserByEmailOrPhone(String email, String password);

     Optional<User> findUserByUsername(String username);
}
