package ace.ucv.messenger.service.implementation;

import ace.ucv.messenger.entity.User;
import ace.ucv.messenger.repository.UserRepository;
import ace.ucv.messenger.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Override
    public List<String> getAllUsers() {
        return userRepository.findAll()
                             .stream()
                             .map(User::getUsername)
                             .toList();
    }
}
