package ace.ucv.messenger.service;

import ace.ucv.messenger.dto.LoginRequest;
import ace.ucv.messenger.dto.LoginResponse;
import ace.ucv.messenger.dto.RegisterRequest;
import ace.ucv.messenger.entity.User;

public interface AuthenticationService {

    void signUp(RegisterRequest request);

    LoginResponse signIn(LoginRequest request);
}
