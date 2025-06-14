package ace.ucv.messenger.service.implementation;

import ace.ucv.messenger.dto.ChangePasswordDto;
import ace.ucv.messenger.dto.UserCredentialsDto;
import ace.ucv.messenger.entity.User;
import ace.ucv.messenger.exceptions.AlreadyExistsException;
import ace.ucv.messenger.exceptions.PasswordNotMatchException;
import ace.ucv.messenger.exceptions.UserNotFoundException;
import ace.ucv.messenger.repository.UserRepository;
import ace.ucv.messenger.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private static final String USER_NOT_FOUND_ERROR_MESSAGE = "User not found with username: ";
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

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
}
