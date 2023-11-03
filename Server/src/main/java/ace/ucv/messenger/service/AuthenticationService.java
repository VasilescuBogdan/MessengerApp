package ace.ucv.messenger.service;

import ace.ucv.messenger.dto.SignInRequest;
import ace.ucv.messenger.dto.SignInResponse;
import ace.ucv.messenger.dto.SignUpRequest;
import ace.ucv.messenger.entity.User;

public interface AuthenticationService {

    User signUp(SignUpRequest request);

    SignInResponse signIn(SignInRequest request);
}
