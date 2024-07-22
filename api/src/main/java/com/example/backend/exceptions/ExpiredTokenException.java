package com.example.backend.exceptions;

public class ExpiredTokenException extends RuntimeException {
    public ExpiredTokenException(String exception) {
        super(exception);
    }
}
