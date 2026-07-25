package com.unireserve.entity.Exception;

public class UserAlreadyExistExpetion extends RuntimeException {
    public UserAlreadyExistExpetion(String message) {
        super(message);
    }
}
