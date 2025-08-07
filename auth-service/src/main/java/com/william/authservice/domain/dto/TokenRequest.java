package com.william.authservice.domain.dto;

import jakarta.validation.constraints.NotBlank;

public record TokenRequest(
        @NotBlank(message = "Se debe proporcionar un token de acceso")
        String accessToken) {
}
