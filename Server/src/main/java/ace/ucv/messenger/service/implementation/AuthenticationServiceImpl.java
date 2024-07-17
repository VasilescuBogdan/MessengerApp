package ace.ucv.messenger.service.implementation;

import ace.ucv.messenger.dto.LoginRequest;
import ace.ucv.messenger.dto.LoginResponse;
import ace.ucv.messenger.dto.RegisterRequest;
import ace.ucv.messenger.entity.User;
import ace.ucv.messenger.exceptions.UserNotFoundException;
import ace.ucv.messenger.repository.UserRepository;
import ace.ucv.messenger.jwt.JwtUtil;
import ace.ucv.messenger.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Override
    public void signUp(RegisterRequest request) {
        User newUser = User.builder()
                           .username(request.getUsername())
                           .email(request.getEmail())
                           .phone(request.getPhone())
                           .password(passwordEncoder.encode(request.getPassword()))
                           .build();
        userRepository.save(newUser);
    }

    @Override
    public LoginResponse signIn(LoginRequest loginRequest) {
        String credential = loginRequest.getCredential();
        String password = loginRequest.getPassword();
        User user = userRepository.getUserByEmailOrPhone(credential)
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
