package ace.ucv.messenger.service;

import ace.ucv.messenger.dto.ChangePasswordDto;
import ace.ucv.messenger.dto.UserCredentialsDto;

import java.util.List;

public interface UserService {
    List<String> getAllUsers();

    void changePassword(ChangePasswordDto changePasswordDto, String currentUser);

    UserCredentialsDto getUserCredentials(String username);

    void changeEmail(String newEmail, String username);
}
