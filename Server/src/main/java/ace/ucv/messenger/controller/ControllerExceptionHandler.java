package ace.ucv.messenger.controller;

import ace.ucv.messenger.dto.ErrorMessage;
import ace.ucv.messenger.exceptions.PasswordNotMatchException;
import ace.ucv.messenger.exceptions.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.client.ResourceAccessException;

@ControllerAdvice
@ResponseBody
public class ControllerExceptionHandler {

    @ExceptionHandler(value = UserNotFoundException.class)
    @ResponseStatus(value = HttpStatus.NOT_FOUND)
    public ErrorMessage userNotFoundException() {
        return new ErrorMessage("There is no user with those credentials.");
    }

    @ExceptionHandler(value = PasswordNotMatchException.class)
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    public ErrorMessage passwordNotMatchException(RuntimeException ex) {
        return new ErrorMessage(ex.getMessage());
    }

    @ExceptionHandler(value = ResourceAccessException.class)
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    public ErrorMessage resourceAlreadyExistsException(RuntimeException ex) {
        return new ErrorMessage(ex.getMessage());
    }
}
