package com.william.authservice.service;

import com.william.authservice.config.AuthenticationException;
import com.william.authservice.config.PersonaFeign;
import com.william.authservice.config.TokenException;
import com.william.authservice.domain.dto.AuthResponse;
import com.william.authservice.domain.dto.LoginDTO;
import com.william.authservice.domain.dto.PersonDTO;
import com.william.authservice.domain.model.Person;
import com.william.authservice.domain.model.RefreshToken;
import com.william.authservice.messaging.DomainEventPublisher;
import com.william.authservice.repository.PersonaRepository;
import com.william.authservice.repository.RefreshTokenRepository;
import feign.FeignException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.Objects;

import static com.william.authservice.service.TokenService.ACCESS_TOKEN_MINUTES_TO_EXPIRE;

@Service
public class AuthService {

    private final Logger log = LoggerFactory.getLogger(AuthService.class);
    private final PersonaFeign personaFeign;
    private final TokenService tokenService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PersonaRepository personaRepository;
    private final DomainEventPublisher eventPublisher;
    private final String authEventsTopic;

    public AuthService(PersonaFeign personaFeign, TokenService tokenService,
                       RefreshTokenRepository refreshTokenRepository, PersonaRepository personaRepository,
                       DomainEventPublisher eventPublisher,
                       @Value("${app.kafka.topics.auth}") String authEventsTopic) {
        this.personaFeign = personaFeign;
        this.tokenService = tokenService;
        this.refreshTokenRepository = refreshTokenRepository;
        this.personaRepository = personaRepository;
        this.eventPublisher = eventPublisher;
        this.authEventsTopic = authEventsTopic;
    }

    public AuthResponse authenticate(String document, String password) {
        LoginDTO loginDTO = new LoginDTO(document, password);
        try {
            ResponseEntity<PersonDTO> response = personaFeign.verifyCredentials(loginDTO);
            if (response.getStatusCode().is2xxSuccessful() && Objects.nonNull(response.getBody())) {
                PersonDTO person = response.getBody();
                tokenService.generateAndStoreRefreshToken(person);
                Pair<String, Instant> token = tokenService.generateToken(person, ACCESS_TOKEN_MINUTES_TO_EXPIRE,
                        TokenService.ACCESS_TOKEN_UNIT);
                eventPublisher.publish(authEventsTopic, "USER_AUTHENTICATED", String.valueOf(person.getId()),
                        Map.of("personId", person.getId(), "document", person.getDocument()));
                return new AuthResponse(token.getFirst(), "access", token.getSecond(), null);
            }
        } catch (FeignException.BadRequest e) {
            throw new AuthenticationException("Error al autenticarse. Credenciales inválidas.");
        }
        throw new AuthenticationException("Error al autenticarse. No se pudo verificar las credenciales.");
    }

    public AuthResponse refreshToken(String expiredToken) {
        RefreshToken refreshToken = getRefreshToken(expiredToken);
        if (refreshToken.isRevoked()) {
            throw new TokenException("Token de refresh revocado");
        }
        if (!tokenService.isTokenValid(refreshToken.getToken())) {
            refreshToken.setRevoked(true);
            refreshTokenRepository.save(refreshToken);
            throw new TokenException("Token de refresh expirado o inválido");
        }
        Person person = personaRepository.findById(refreshToken.getPersonId())
                .orElseThrow(() -> new AuthenticationException("No se encuentra a la persona con id " + refreshToken.getPersonId()));
        PersonDTO personDto = new PersonDTO();
        BeanUtils.copyProperties(person, personDto);
        Pair<String, Instant> token = tokenService.generateToken(personDto, ACCESS_TOKEN_MINUTES_TO_EXPIRE,
                TokenService.ACCESS_TOKEN_UNIT);
        return new AuthResponse(token.getFirst(), "access", token.getSecond(), null);
    }

    public void logout(String accessToken) {
        RefreshToken refreshToken = getRefreshToken(accessToken);
        if (refreshToken.isRevoked()) {
            return;
        }
        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);
        log.info("Token revocado para usuario con ID: {}", refreshToken.getPersonId());
    }

    private RefreshToken getRefreshToken(String token) {
        Long personId = tokenService.extractPersonIdFromExpiredToken(token);
        return refreshTokenRepository.findByPersonId(personId)
                .orElseThrow(() -> new TokenException("Token de refresco no encontrado"));
    }
}
