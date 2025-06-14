package ace.ucv.messenger.service.implementation;

import ace.ucv.messenger.dto.ChangePasswordDto;
import ace.ucv.messenger.entity.User;
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
                .orElseThrow(() -> new UserNotFoundException("User not found with username: " + currentUser));
        if (!encoder.matches(changePasswordDto.getOldPassword(), user.getPassword())) {
            throw new PasswordNotMatchException("Old password is incorrect");
        }
        user.setPassword(encoder.encode(changePasswordDto.getNewPassword()));
        userRepository.save(user);
    }
}
