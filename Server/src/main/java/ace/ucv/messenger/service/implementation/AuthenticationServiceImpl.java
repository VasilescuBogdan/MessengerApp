package ace.ucv.messenger.service.implementation;

import ace.ucv.messenger.dto.LoginRequest;
import ace.ucv.messenger.dto.LoginResponse;
import ace.ucv.messenger.dto.RegisterRequest;
import ace.ucv.messenger.entity.User;
import ace.ucv.messenger.exceptions.UserNotFoundException;
import ace.ucv.messenger.repository.UserRepository;
import ace.ucv.messenger.security.JwtUtil;
import ace.ucv.messenger.service.AuthenticationService;
import ace.ucv.messenger.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationServiceImpl.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final ChatService chatService;
    private final JwtUtil jwtUtil;

    @Override
    public void signUp(RegisterRequest request) {
        User newUser = User.builder()
                           .username(request.getUsername())
                           .email(request.getEmail())
                           .phone(request.getPhone())
                           .password(passwordEncoder.encode(request.getPassword()))
                           .build();
        try {
            for (User user : userRepository.findAll()) {
                chatService.addChat(newUser.getUsername(), user.getUsername());
            }
            userRepository.save(newUser);
        } catch (RuntimeException e) {
            logger.error("An error occurred: {}", e.getMessage(), e);
        }
    }

    @Override
    public LoginResponse signIn(LoginRequest loginRequest) {
        String credential = loginRequest.getCredential();
        String password = loginRequest.getPassword();
        User user = userRepository.findUserByEmailOrPhone(credential, credential)
                                  .orElseThrow(() -> new UserNotFoundException(""));
        String username = user.getUsername();
        authenticate(username, password);

        UserDetails userDetails = jwtService.loadUserByUsername(username);
        String newGeneratedToken = jwtUtil.generateToken(userDetails);

        return new LoginResponse(newGeneratedToken, username);
    }

    private void authenticate(String username, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
    }
}
