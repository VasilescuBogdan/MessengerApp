package ace.ucv.messenger.controller;

import ace.ucv.messenger.dto.SignInRequest;
import ace.ucv.messenger.dto.SignInResponse;
import ace.ucv.messenger.dto.SignUpRequest;
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
    public User signup(@RequestBody SignUpRequest request) {
        return authenticationService.signUp(request);
    }

    @PostMapping("/signin")
    @ResponseStatus(HttpStatus.OK)
    public SignInResponse signin(@RequestBody SignInRequest request) {
        return authenticationService.signIn(request);
    }
}
