package ace.ucv.messenger.service;

import ace.ucv.messenger.dto.ChangePasswordDto;

import java.util.List;

public interface UserService {
    List<String> getAllUsers();
    void changePassword(ChangePasswordDto changePasswordDto, String currentUser);
}
