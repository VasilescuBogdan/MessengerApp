package ace.ucv.messenger.exceptions;

public class PasswordNotMatchException extends RuntimeException {
    public PasswordNotMatchException(String oldPasswordIsIncorrect) {
        super(oldPasswordIsIncorrect);
    }
}
