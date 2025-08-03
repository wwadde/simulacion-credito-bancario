package com.william.persona.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;

@Configuration
public class AuthEvents {

    @EventListener
    public void handleAuthenticationSuccess(AuthenticationSuccessEvent event) {
        // Handle successful authentication event
        System.out.println("Authentication successful for user: " + event.getAuthentication().getName());
    }

}
