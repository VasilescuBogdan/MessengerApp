package ace.ucv.messenger.service.implementation;

import ace.ucv.messenger.dto.ChangePasswordDto;
import ace.ucv.messenger.dto.UserCredentialsDto;
import ace.ucv.messenger.entity.User;
import ace.ucv.messenger.exceptions.AlreadyExistsException;
import ace.ucv.messenger.exceptions.PasswordNotMatchException;
import ace.ucv.messenger.exceptions.UserNotFoundException;
import ace.ucv.messenger.repository.ChatRepository;
import ace.ucv.messenger.repository.GroupChatRepository;
import ace.ucv.messenger.repository.UserRepository;
import ace.ucv.messenger.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private static final String USER_NOT_FOUND_ERROR_MESSAGE = "User not found with username: ";
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final ChatRepository chatRepository;
    private final GroupChatRepository groupChatRepository;

    @Override
    public List<String> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(User::getUsername)
                .toList();
    }

    @Override
    public void changePassword(ChangePasswordDto changePasswordDto, String currentUser) {
        User user = userRepository.findUserByUsername(currentUser)
                .orElseThrow(() -> new UserNotFoundException(USER_NOT_FOUND_ERROR_MESSAGE + currentUser));
        if (!encoder.matches(changePasswordDto.getOldPassword(), user.getPassword())) {
            throw new PasswordNotMatchException("Old password is incorrect");
        }
        user.setPassword(encoder.encode(changePasswordDto.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public UserCredentialsDto getUserCredentials(String username) {
        User user = userRepository.findUserByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(USER_NOT_FOUND_ERROR_MESSAGE + username));
        return UserCredentialsDto.builder()
                .email(user.getEmail())
                .phone(user.getPhone())
                .build();
    }

    @Override
    public void changeEmail(String newEmail, String username) {
        User user = userRepository.findUserByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(USER_NOT_FOUND_ERROR_MESSAGE + username));
        if (userRepository.existsByEmail((newEmail))) {
            throw new AlreadyExistsException("Email already in use: " + newEmail);
        }
        user.setEmail(newEmail);
        userRepository.save(user);
    }

    @Override
    public void changePhone(String newPhone, String username) {
        User user = userRepository.findUserByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(USER_NOT_FOUND_ERROR_MESSAGE + username));
        if (userRepository.existsByPhone(newPhone)) {
            throw new AlreadyExistsException("Phone already in use: " + newPhone);
        }
        user.setPhone(newPhone);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void changeUsername(String newUsername, String username) {
        User user = userRepository.findUserByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(USER_NOT_FOUND_ERROR_MESSAGE + username));
        if (userRepository.findUserByUsername(newUsername).isPresent()) {
            throw new AlreadyExistsException("Username already in use: " + newUsername);
        }
        user.setUsername(newUsername);
        userRepository.save(user);
        chatRepository.findAll().forEach(chat -> {
            chat.getMessages()
                    .stream()
                    .filter(message -> message.getSender().equals(username))
                    .forEach(message -> message.setSender(newUsername));
            if (chat.getFirstUser().equals(username)) {
                chat.setFirstUser(newUsername);
            }
            if (chat.getSecondUser().equals(username)) {
                chat.setSecondUser(newUsername);
            }
            chatRepository.save(chat);
        });
        groupChatRepository.findAll().forEach(groupChat -> {
            groupChat.getUsers().remove(username);
            groupChat.getUsers().add(newUsername);
            groupChat.getMessages()
                    .stream()
                    .filter(message -> message.getSender().equals(username))
                    .forEach(message -> message.setSender(newUsername));
            groupChatRepository.save(groupChat);
        });
    }
}
