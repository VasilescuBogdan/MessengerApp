package ace.ucv.messenger.controller;

import ace.ucv.messenger.dto.*;
import ace.ucv.messenger.service.AuthenticationService;
import ace.ucv.messenger.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin
public class UserController {

    private final AuthenticationService authenticationService;
    private final UserService userService;

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public void signUp(@RequestBody RegisterRequest request) {
        authenticationService.signUp(request);
    }

    @PostMapping("/signin")
    @ResponseStatus(HttpStatus.OK)
    public LoginResponse signIn(@RequestBody LoginRequest request) throws Exception {
        return authenticationService.signIn(request);
    }

    @GetMapping()
    @SecurityRequirement(name = "Bearer Authentication")
    @ResponseStatus(HttpStatus.OK)
    public List<String> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/password")
    @ResponseStatus(HttpStatus.OK)
    @SecurityRequirement(name = "Bearer Authentication")
    public void changePassword(@RequestBody ChangePasswordDto changePasswordDto, Principal principal) {
        userService.changePassword(changePasswordDto, principal.getName());
    }

    @GetMapping("/credentials")
    @SecurityRequirement(name = "Bearer Authentication")
    @ResponseStatus(HttpStatus.OK)
    public UserCredentialsDto getCurrentUserCredentials(Principal principal) {
        return userService.getUserCredentials(principal.getName());
    }

    @PutMapping("/email")
    @ResponseStatus(HttpStatus.OK)
    @SecurityRequirement(name = "Bearer Authentication")
    public void changeEmail(@RequestParam("newEmail") String newEmail, Principal principal) {
        userService.changeEmail(newEmail, principal.getName());
    }
}
