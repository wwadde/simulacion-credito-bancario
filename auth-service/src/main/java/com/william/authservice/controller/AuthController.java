package com.william.authservice.controller;

import com.william.authservice.domain.dto.AuthResponse;
import com.william.authservice.domain.dto.LoginDTO;
import com.william.authservice.domain.dto.RefreshTokenRequest;
import com.william.authservice.service.AuthService;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AuthController {

    private Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }


    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginDTO loginDTO) {
        return authService.authenticate(loginDTO.document(), loginDTO.password());
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(JwtAuthenticationToken jwtAuthenticationToken) {
        logger.info("Logout request received");
        String token = jwtAuthenticationToken.getToken().getTokenValue();
        logger.info("Token: " + token);
        authService.logout(token);
        return ResponseEntity.ok("Logout successful");
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody RefreshTokenRequest request) {

        return ResponseEntity.ok(authService.refreshToken(request.accessToken()));
    }



}
