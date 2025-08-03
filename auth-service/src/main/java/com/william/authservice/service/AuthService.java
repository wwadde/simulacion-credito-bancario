package com.william.authservice.service;

import com.william.authservice.config.AuthenticationException;
import com.william.authservice.config.PersonaFeign;
import com.william.authservice.config.TokenException;
import com.william.authservice.domain.dto.AuthResponse;
import com.william.authservice.domain.dto.LoginDTO;
import com.william.authservice.domain.dto.PersonDTO;
import com.william.authservice.domain.model.Person;
import com.william.authservice.domain.model.RefreshToken;
import com.william.authservice.repository.PersonaRepository;
import com.william.authservice.repository.RefreshTokenRepository;
import feign.FeignException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Objects;

import static com.william.authservice.service.TokenService.*;

@Service
public class AuthService {

    Logger log = LoggerFactory.getLogger(AuthService.class);
    private final PersonaFeign personaFeign;
    private final TokenService tokenService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PersonaRepository personaRepository;

    public AuthService(PersonaFeign personaFeign, TokenService tokenService, RefreshTokenRepository refreshTokenRepository, PersonaRepository personaRepository) {
        this.personaFeign = personaFeign;
        this.tokenService = tokenService;
        this.refreshTokenRepository = refreshTokenRepository;
        this.personaRepository = personaRepository;
    }

    public AuthResponse authenticate(String document, String password) {
        LoginDTO loginDTO = new LoginDTO(document, password);
        try {

            ResponseEntity<PersonDTO> response = personaFeign.verifyCredentials(loginDTO);
            if ( response.getStatusCode().is2xxSuccessful() && Objects.nonNull(response.getBody())) {
                PersonDTO datos = response.getBody();
                tokenService.generateAndStoreRefreshToken(datos);
                Pair<String, Instant> datosToken = tokenService.generateToken(datos, ACCESS_TOKEN_MINUTES_TO_EXPIRE, TokenService.ACCESS_TOKEN_UNIT);
                return new AuthResponse(datosToken.getFirst(), "access", datosToken.getSecond(), null);
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
        Pair<String, Instant> datosToken = tokenService.generateToken(personDto, ACCESS_TOKEN_MINUTES_TO_EXPIRE, ACCESS_TOKEN_UNIT);

        return new AuthResponse(datosToken.getFirst(), "access", datosToken.getSecond(), null);
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
        return refreshTokenRepository
                .findByPersonId(personId)
                .orElseThrow(() -> new TokenException("Token de refresco no encontrado"));

    }
}
