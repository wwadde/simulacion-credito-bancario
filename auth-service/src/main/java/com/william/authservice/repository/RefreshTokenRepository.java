package com.william.authservice.repository;

import com.william.authservice.domain.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByTokenAndRevokedFalse(String token);
    Optional<RefreshToken> findByPersonIdAndRevokedFalse(Long personId);
    Optional<RefreshToken> findByPersonId(Long personId);
    void deleteByExpiryDateBefore(Instant date);
}
