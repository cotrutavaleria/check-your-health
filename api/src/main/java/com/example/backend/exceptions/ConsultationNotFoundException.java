package com.example.backend.exceptions;

public class ConsultationNotFoundException extends RuntimeException {
    public ConsultationNotFoundException(String exception) {
        super(exception);
    }
}
