package org.baaksa.exception;

import org.springframework.security.core.AuthenticationException;

public class UserAlreadyExist extends AuthenticationException {

    public UserAlreadyExist() {
        super("Email already exist");
    }
}
