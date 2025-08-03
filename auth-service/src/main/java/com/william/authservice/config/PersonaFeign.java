package com.william.authservice.config;

import com.william.authservice.domain.dto.AddPersonDTO;
import com.william.authservice.domain.dto.LoginDTO;
import com.william.authservice.domain.dto.PersonDTO;
import jakarta.validation.Valid;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@FeignClient(name = "persona-service", path = "/persona/public")
public interface PersonaFeign {

    @PostMapping("/verifyCredentials")
    ResponseEntity<PersonDTO> verifyCredentials(@Valid @RequestBody LoginDTO loginDTO);

    @PostMapping("/register")
    ResponseEntity<String> savePerson(@Valid @RequestBody AddPersonDTO personDTO);
}