package ace.ucv.messenger.service.implementation;

import ace.ucv.messenger.dto.LoginRequest;
import ace.ucv.messenger.dto.LoginResponse;
import ace.ucv.messenger.dto.RegisterRequest;
import ace.ucv.messenger.entity.User;
import ace.ucv.messenger.exceptions.UserNotFoundException;
import ace.ucv.messenger.repository.UserRepository;
import ace.ucv.messenger.service.AuthenticationService;
import ace.ucv.messenger.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    @Override
    public void signUp(RegisterRequest request) {
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        userRepository.save(user);
    }

    @Override
    public LoginResponse signIn(LoginRequest request) {
        User user = userRepository.findUserByEmailOrPhone(request.getCredential(), request.getCredential())
                .orElseThrow(() -> new UserNotFoundException("User not in database"));
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), request.getPassword()));
        String jwt = jwtService.generateToken(user);
        return LoginResponse.builder().token(jwt).build();
    }
}
