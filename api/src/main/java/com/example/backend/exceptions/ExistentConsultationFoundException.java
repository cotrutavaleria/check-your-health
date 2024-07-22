package com.example.backend.exceptions;

public class ExistentConsultationFoundException extends RuntimeException {
    public ExistentConsultationFoundException(String exception) {
        super(exception);
    }
}
