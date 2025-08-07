package com.william.authservice.service;



import com.william.authservice.controller.AuthController;
import com.william.authservice.domain.dto.AuthResponse;
import com.william.authservice.domain.dto.TokenRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerRefreshTokenTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private TokenRequest tokenRequest;
    private AuthResponse authResponse;

    @BeforeEach
    void setUp() {
        tokenRequest = new TokenRequest("expired-access-token");
        authResponse = new AuthResponse("new-access-token", "access", Instant.now(), null);
    }

    @Test
    void refreshToken_ShouldReturnNewAccessToken_WhenRequestIsValid() {
        // Given
        when(authService.refreshToken(anyString())).thenReturn(authResponse);

        // When
        ResponseEntity<AuthResponse> response = authController.refreshToken(tokenRequest);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("new-access-token", response.getBody().accessToken());
        assertEquals("access", response.getBody().tokenType());
    }

    @Test
    void refreshToken_ShouldCallAuthServiceWithCorrectToken() {
        // Given
        String expectedToken = "test-expired-token";
        TokenRequest request = new TokenRequest(expectedToken);
        when(authService.refreshToken(expectedToken)).thenReturn(authResponse);

        // When
        authController.refreshToken(request);

        // Then
        verify(authService).refreshToken(expectedToken);
    }
}