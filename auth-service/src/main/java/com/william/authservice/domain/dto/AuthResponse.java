package com.william.authservice.domain.dto;

import java.time.Instant;

public record AuthResponse(
        String accessToken,
        String tokenType,
        Instant expiresAt,
        String error
) {

    public AuthResponse(String error) {
        this(null, null, null, error);
    }

}
