package ace.ucv.messenger.repository;

import ace.ucv.messenger.entity.Chat;
import ace.ucv.messenger.entity.Message;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@DataMongoTest
class TestChatRepository {

    @Autowired
    private ChatRepository chatRepository;
    private static final List<Chat> chats = new ArrayList<>();

    @BeforeEach
    void setUp() {
        Chat chat1 = Chat.builder()
                         .firstUser("user1")
                         .secondUser("user2")
                         .messages(List.of(Message.builder()
                                                  .date(LocalDate.of(2020, 11, 10))
                                                  .time(LocalTime.of(13, 20, 0))
                                                  .content("Hey hai sa mergem la masa")
                                                  .build()))
                         .build();
        Chat chat2 = Chat.builder()
                         .firstUser("user2")
                         .secondUser("user3")
                         .messages(List.of(Message.builder()
                                                  .date(LocalDate.of(2022, 8, 15))
                                                  .time(LocalTime.of(9, 4, 13))
                                                  .content("Jk")
                                                  .build()))
                         .build();
        Collections.addAll(chats, chat1, chat2);
        chatRepository.saveAll(chats);
    }

    @AfterEach
    void tearDown() {
        chats.clear();
        chatRepository.deleteAll();
    }

    @Test
    void chatByExistingUser() {
        //given
        String user = "user1";

        //when
        List<Chat> chatQuery = chatRepository.getChatsOfUser(user);

        //then
        Assertions.assertFalse(chatQuery.isEmpty());
    }

    @Test
    void chatByNonExistingUser() {
        //given
        String user = "not user";

        //when
        List<Chat> chatQuery = chatRepository.getChatsOfUser(user);

        //then
        Assertions.assertTrue(chatQuery.isEmpty());
    }


    @Test
    void chatShouldExist() {
        //given
        List<String> participants = List.of("user2", "user3");

        //when
        Optional<Chat> chatQuery = chatRepository.getChatByParticipants(participants);

        //then
        Assertions.assertTrue(chatQuery.isPresent());
    }

    @Test
    void chatShouldNotExist() {
        //given
        List<String> participants = List.of("user1", "user3");

        //when
        Optional<Chat> chatQuery = chatRepository.getChatByParticipants(participants);

        //then
        Assertions.assertFalse(chatQuery.isPresent());
    }
}