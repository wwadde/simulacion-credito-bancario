package com.william.authservice.config;

public class TokenException extends RuntimeException {
    public TokenException(String message) {
        super(message);
    }
}
