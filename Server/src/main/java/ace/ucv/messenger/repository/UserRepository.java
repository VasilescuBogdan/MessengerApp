package ace.ucv.messenger.repository;

import ace.ucv.messenger.entity.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, ObjectId> {
    @Query("{ '$or':  [ { 'email' : ?0 }, { 'phone': ?0 } ] }")
    Optional<User> getUserByEmailOrPhone(String credential);

    Optional<User> findUserByUsername(String username);

    boolean existsByEmail(String email);
}
