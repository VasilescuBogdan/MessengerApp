package ace.ucv.messenger.controller;

import ace.ucv.messenger.dto.LoginRequest;
import ace.ucv.messenger.dto.LoginResponse;
import ace.ucv.messenger.dto.RegisterRequest;
import ace.ucv.messenger.entity.User;
import ace.ucv.messenger.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin
public class UserController {

    private final AuthenticationService authenticationService;

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public void signup(@RequestBody RegisterRequest request) {
        authenticationService.signUp(request);
    }

    @PostMapping("/signin")
    @ResponseStatus(HttpStatus.OK)
    public LoginResponse signin(@RequestBody LoginRequest request) {
        return authenticationService.signIn(request);
    }
}
