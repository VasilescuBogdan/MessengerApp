package ace.ucv.messenger.repository;

import ace.ucv.messenger.entity.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataMongoTest
class TestUserRepository {

    @Autowired
    private UserRepository userRepository;
    private static final List<User> userList = new ArrayList<>();

    @BeforeEach
    void setUp() {
        User user1 = new User();
        user1.setUsername("user1");
        user1.setEmail("user1@text.com");
        user1.setPhone("1111111111");
        user1.setPassword("111111");
        User user2 = new User();
        user2.setUsername("user2");
        user2.setEmail("user2@text.com");
        user2.setPhone("2222222222");
        user2.setPassword("222222");
        User user3 = new User();
        user3.setUsername("user3");
        user3.setEmail("user3@text.com");
        user3.setPhone("3");
        user3.setPassword("3");
        Collections.addAll(userList, user1, user2, user3);
        userRepository.saveAll(userList);
    }

    @AfterEach
    void tearDown() {
        userList.clear();
        userRepository.deleteAll();
    }

    @Test
    void userExistByEmail() {
        //given
        String email = "user1@text.com";

        //when
        Optional<User> actualUser = userRepository.getUserByEmailOrPhone(email);

        //then
        assertTrue(actualUser.isPresent());
        assertEquals(userList.get(0), actualUser.get());
    }

    @Test
    void userNotExistByEmail() {
        //given
        String email = "not email";

        //when
        Optional<User> actualUser = userRepository.getUserByEmailOrPhone(email);

        //then
        assertFalse(actualUser.isPresent());
    }

    @Test
    void userExistsByPhone() {
        //given
        String phone = "2222222222";

        //when
        Optional<User> actualUser = userRepository.getUserByEmailOrPhone(phone);

        //then
        assertTrue(actualUser.isPresent());
        assertEquals(userList.get(1), actualUser.get());
    }

    @Test
    void userNotExistsByPhone() {
        //given
        String phone = "0000000000";

        //when
        Optional<User> actualUser = userRepository.getUserByEmailOrPhone(phone);

        //then
        assertFalse(actualUser.isPresent());
    }

    @Test
    void userExistByUsername() {
        //given
        String username = "user3";

        //when
        Optional<User> actualUser = userRepository.findUserByUsername(username);

        //then
        assertTrue(actualUser.isPresent());
        assertEquals(userList.get(2), actualUser.get());
    }

    @Test
    void userNotExistByUsername() {
        //given
        String username = "not user";

        //when
        Optional<User> actualUser = userRepository.findUserByUsername(username);

        //then
        assertFalse(actualUser.isPresent());
    }

}