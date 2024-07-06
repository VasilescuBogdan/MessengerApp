package ace.ucv.messenger.repository;

import ace.ucv.messenger.entity.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.AutoConfigureDataMongo;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataMongoTest
@AutoConfigureDataMongo
class TestUserRepository {

    @Autowired
    private UserRepository userRepository;

    @AfterEach
    void tearDown() {
        userRepository.deleteAll();
    }

    @Test
    void userExistsByEmail() {
        //given
        String email = "user1@text.com";
        User user = new User();
        user.setUsername("user1");
        user.setEmail(email);
        user.setPhone("077374014711");
        user.setPassword("222222");
        userRepository.save(user);

        //when
        Optional<User> actualUser = userRepository.findUserByEmailOrPhone(email, email);

        //then
        assertTrue(actualUser.isPresent());
        assertEquals(user.getUsername(), actualUser.get()
                                                   .getUsername());
        assertEquals(user.getPhone(), actualUser.get()
                                                .getPhone());
        assertEquals(user.getPassword(), actualUser.get()
                                                   .getPassword());
    }

    @Test
    void userExistsByPhone() {
        //given
        String phone = "077374014711";
        User user = new User();
        user.setUsername("user");
        user.setEmail("user1@text.com");
        user.setPhone(phone);
        user.setPassword("222222");
        userRepository.save(user);

        //when
        Optional<User> actualUser = userRepository.findUserByEmailOrPhone(phone, phone);

        //then
        assertTrue(actualUser.isPresent());
        assertEquals(user.getUsername(), actualUser.get()
                                                   .getUsername());
        assertEquals(user.getPhone(), actualUser.get()
                                                .getPhone());
        assertEquals(user.getPassword(), actualUser.get()
                                                   .getPassword());
    }

    @Test
    void userExistsByUsername() {
        //given
        String username = "user";
        User user = new User();
        user.setUsername(username);
        user.setEmail("user1@text.com");
        user.setPhone("1234567890");
        user.setPassword("222222");
        userRepository.save(user);

        //when
        Optional<User> actualUser = userRepository.findUserByUsername(username);

        //then
        assertTrue(actualUser.isPresent());
        assertEquals(user.getUsername(), actualUser.get()
                                                   .getUsername());
        assertEquals(user.getPhone(), actualUser.get()
                                                .getPhone());
        assertEquals(user.getPassword(), actualUser.get()
                                                   .getPassword());
    }

}