package com.william.authservice.service;

import com.william.authservice.domain.dto.PersonDTO;
import com.william.authservice.domain.model.RefreshToken;
import com.william.authservice.repository.RefreshTokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.util.Pair;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;


import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;


@Service
public class TokenService {

    private final Logger log = LoggerFactory.getLogger(TokenService.class);
    private final JwtEncoder encoder;
    private final JwtDecoder decoder;
    private final RefreshTokenRepository refreshTokenRepository;
    public static final long ACCESS_TOKEN_MINUTES_TO_EXPIRE = 10;
    public static final ChronoUnit ACCESS_TOKEN_UNIT = ChronoUnit.MINUTES;
    public static final long REFRESH_TOKEN_DAYS_TO_EXPIRE = 1;
    public static final ChronoUnit REFRESH_TOKEN_UNIT = ChronoUnit.DAYS;

    @Value("${auth.base-url}")
    private String issuerUri;


    public TokenService(JwtEncoder encoder, @Qualifier("expiredTokenDecoder") JwtDecoder decoder, RefreshTokenRepository refreshTokenRepository) {
        this.encoder = encoder;
        this.decoder = decoder;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public Pair<String, Instant> generateToken(PersonDTO person, long expiration, ChronoUnit unit) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(issuerUri)
                .issuedAt(now)
                .expiresAt(now.plus(expiration, unit))
                .subject(person.getName())
                .claim("personId", person.getId())
                .build();
        return Pair.of(this.encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue(), claims.getExpiresAt());
    }

    public Long extractPersonIdFromExpiredToken(String token) {
        Jwt jwt = decoder.decode(token);
        return (Long) jwt.getClaims().get("personId");
    }


    public void generateAndStoreRefreshToken(PersonDTO person) {

        Pair<String, Instant> datosToken = generateToken(person, REFRESH_TOKEN_DAYS_TO_EXPIRE, ChronoUnit.DAYS);

        // Buscar token existente para la persona
        Optional<RefreshToken> existingToken = refreshTokenRepository
                .findByPersonId(person.getId());

        RefreshToken refreshToken = existingToken.orElse(new RefreshToken());
        refreshToken.setPersonId(person.getId());
        refreshToken.setToken(datosToken.getFirst());
        refreshToken.setExpiryDate(datosToken.getSecond());
        refreshToken.setCreatedAt(Instant.now());
        refreshToken.setRevoked(false);
        refreshTokenRepository.save(refreshToken);
        log.info("Refresh token generado para: {}", person.getName());
    }



    public boolean isTokenValid(String token) {
        try {
            decoder.decode(token);
            return true;
        } catch (JwtException e) {
            log.error("Token inválido: {}", e.getMessage());
            return false;
        }
    }



}

