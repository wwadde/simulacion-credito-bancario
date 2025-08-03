package com.william.authservice.service;

import com.william.authservice.config.AuthenticationException;
import com.william.authservice.config.TokenException;
import com.william.authservice.domain.dto.AuthResponse;
import com.william.authservice.domain.dto.PersonDTO;
import com.william.authservice.domain.model.Person;
import com.william.authservice.domain.model.RefreshToken;
import com.william.authservice.repository.PersonaRepository;
import com.william.authservice.repository.RefreshTokenRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.util.Pair;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceRefreshTokenTest {

    @Mock
    private TokenService tokenService;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PersonaRepository personaRepository;

    @InjectMocks
    private AuthService authService;

    private RefreshToken validRefreshToken;
    private Person person;
    private String expiredAccessToken;
    private Long personId;

    @BeforeEach
    void setUp() {
        personId = 1L;
        expiredAccessToken = "expired-access-token";

        validRefreshToken = new RefreshToken();
        validRefreshToken.setPersonId(personId);
        validRefreshToken.setToken("valid-refresh-token");
        validRefreshToken.setRevoked(false);

        person = new Person();
        person.setId(personId);
        person.setName("John Doe");
        person.setDocument("12345678");
    }

    @Test
    void refreshToken_ShouldReturnNewAccessToken_WhenRefreshTokenIsValid() {
        // Given
        when(tokenService.extractPersonIdFromExpiredToken(expiredAccessToken)).thenReturn(personId);
        when(refreshTokenRepository.findByPersonId(personId)).thenReturn(Optional.of(validRefreshToken));
        when(tokenService.isTokenValid(validRefreshToken.getToken())).thenReturn(true);
        when(personaRepository.findById(personId)).thenReturn(Optional.of(person));
        when(tokenService.generateToken(any(PersonDTO.class), eq(10L), eq(TokenService.ACCESS_TOKEN_UNIT)))
                .thenReturn(Pair.of("new-access-token", Instant.now()));

        // When
        AuthResponse response = authService.refreshToken(expiredAccessToken);

        // Then
        assertNotNull(response);
        assertEquals("new-access-token", response.accessToken());
        assertEquals("access", response.tokenType());
        assertNotNull(response.expiresAt());
    }

    @Test
    void refreshToken_ShouldThrowTokenException_WhenRefreshTokenNotFound() {
        // Given
        when(tokenService.extractPersonIdFromExpiredToken(expiredAccessToken)).thenReturn(personId);
        when(refreshTokenRepository.findByPersonId(personId)).thenReturn(Optional.empty());

        // When & Then
        TokenException exception = assertThrows(TokenException.class,
                () -> authService.refreshToken(expiredAccessToken));
        assertEquals("Token de refresco no encontrado", exception.getMessage());
    }

    @Test
    void refreshToken_ShouldThrowTokenException_WhenRefreshTokenIsInvalid() {
        // Given
        when(tokenService.extractPersonIdFromExpiredToken(expiredAccessToken)).thenReturn(personId);
        when(refreshTokenRepository.findByPersonId(personId)).thenReturn(Optional.of(validRefreshToken));
        when(tokenService.isTokenValid(validRefreshToken.getToken())).thenReturn(false);

        // When & Then
        TokenException exception = assertThrows(TokenException.class,
                () -> authService.refreshToken(expiredAccessToken));
        assertEquals("Token de refresh expirado o revocado", exception.getMessage());

        // Verify refresh token is marked as revoked
        verify(refreshTokenRepository).save(argThat(token -> token.isRevoked()));
    }

    @Test
    void refreshToken_ShouldThrowAuthenticationException_WhenPersonNotFound() {
        // Given
        when(tokenService.extractPersonIdFromExpiredToken(expiredAccessToken)).thenReturn(personId);
        when(refreshTokenRepository.findByPersonId(personId)).thenReturn(Optional.of(validRefreshToken));
        when(tokenService.isTokenValid(validRefreshToken.getToken())).thenReturn(true);
        when(personaRepository.findById(personId)).thenReturn(Optional.empty());

        // When & Then
        AuthenticationException exception = assertThrows(AuthenticationException.class,
                () -> authService.refreshToken(expiredAccessToken));
        assertEquals("No se encuentra a la persona con id " + personId, exception.getMessage());
    }

    @Test
    void refreshToken_ShouldCallTokenServiceMethods_WithCorrectParameters() {
        // Given
        when(tokenService.extractPersonIdFromExpiredToken(expiredAccessToken)).thenReturn(personId);
        when(refreshTokenRepository.findByPersonId(personId)).thenReturn(Optional.of(validRefreshToken));
        when(tokenService.isTokenValid(validRefreshToken.getToken())).thenReturn(true);
        when(personaRepository.findById(personId)).thenReturn(Optional.of(person));
        when(tokenService.generateToken(any(PersonDTO.class), anyLong(), any()))
                .thenReturn(Pair.of("new-token", Instant.now()));

        // When
        authService.refreshToken(expiredAccessToken);

        // Then
        verify(tokenService).extractPersonIdFromExpiredToken(expiredAccessToken);
        verify(tokenService).isTokenValid(validRefreshToken.getToken());
        verify(tokenService).generateToken(any(PersonDTO.class), eq(10L), eq(TokenService.ACCESS_TOKEN_UNIT));
    }
}