package com.william.authservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.william.authservice.domain.dto.PersonDTO;
import com.william.authservice.domain.dto.TokenRequest;
import com.william.authservice.domain.model.Person;
import com.william.authservice.domain.model.RefreshToken;
import com.william.authservice.repository.PersonaRepository;
import com.william.authservice.repository.RefreshTokenRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.util.Pair;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PersonaRepository personaRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private TokenService tokenService;

    private Person testPerson;
    private RefreshToken validRefreshToken;

    @BeforeEach
    void setUp() {
        // Create test person
        testPerson = new Person();
        testPerson.setName("Test User");
        testPerson.setDocument("12345678");
        testPerson = personaRepository.save(testPerson);

        // Create valid refresh token using TokenService
        PersonDTO personDTO = new PersonDTO();
        personDTO.setId(testPerson.getId());
        personDTO.setName(testPerson.getName());
        personDTO.setDocument(testPerson.getDocument());

        Pair<String, Instant> tokenData = tokenService.generateToken(personDTO, 1, TokenService.REFRESH_TOKEN_UNIT);

        validRefreshToken = new RefreshToken();
        validRefreshToken.setPersonId(testPerson.getId());
        validRefreshToken.setToken(tokenData.getFirst());
        validRefreshToken.setExpiryDate(tokenData.getSecond());
        validRefreshToken.setCreatedAt(Instant.now());
        validRefreshToken.setRevoked(false);
        validRefreshToken = refreshTokenRepository.save(validRefreshToken);
    }

    @Test
    void refreshToken_ShouldReturnNewAccessToken_WhenValidExpiredTokenProvided() throws Exception {
        // Given
        PersonDTO personDTO = new PersonDTO();
        personDTO.setId(testPerson.getId());
        personDTO.setName(testPerson.getName());
        personDTO.setDocument(testPerson.getDocument());

        // Create an expired token
        Pair<String, Instant> expiredTokenData = tokenService.generateToken(personDTO, -1, TokenService.ACCESS_TOKEN_UNIT);
        String expiredToken = expiredTokenData.getFirst();

        TokenRequest request = new TokenRequest(expiredToken);

        // When & Then
        mockMvc.perform(post("/refresh-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.type").value("access"))
                .andExpect(jsonPath("$.expiresAt").exists());
    }

    @Test
    void refreshToken_ShouldReturnBadRequest_WhenRefreshTokenNotFound() throws Exception {
        // Given
        PersonDTO nonExistentPerson = new PersonDTO();
        nonExistentPerson.setId(999L);
        nonExistentPerson.setName("Non Existent");
        nonExistentPerson.setDocument("999999999");

        Pair<String, Instant> expiredTokenData = tokenService.generateToken(nonExistentPerson, -1, TokenService.ACCESS_TOKEN_UNIT);
        String expiredToken = expiredTokenData.getFirst();

        TokenRequest request = new TokenRequest(expiredToken);

        // When & Then
        mockMvc.perform(post("/refresh-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void refreshToken_ShouldReturnBadRequest_WhenRefreshTokenIsRevoked() throws Exception {
        // Given
        validRefreshToken.setRevoked(true);
        refreshTokenRepository.save(validRefreshToken);

        PersonDTO personDTO = new PersonDTO();
        personDTO.setId(testPerson.getId());
        personDTO.setName(testPerson.getName());
        personDTO.setDocument(testPerson.getDocument());

        Pair<String, Instant> expiredTokenData = tokenService.generateToken(personDTO, -1, TokenService.ACCESS_TOKEN_UNIT);
        String expiredToken = expiredTokenData.getFirst();

        TokenRequest request = new TokenRequest(expiredToken);

        // When & Then
        mockMvc.perform(post("/refresh-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void refreshToken_ShouldReturnBadRequest_WhenInvalidTokenFormat() throws Exception {
        // Given
        TokenRequest request = new TokenRequest("invalid-token-format");

        // When & Then
        mockMvc.perform(post("/refresh-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}