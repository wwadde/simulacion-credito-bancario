package com.william.persona.infrastructure.controller;

import com.william.persona.infrastructure.dto.AddPersonDTO;
import com.william.persona.infrastructure.dto.LoginDTO;
import com.william.persona.infrastructure.dto.PersonDTO;
import com.william.persona.service.PersonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
public class PublicPersonController {

    private final PersonService personService;

    @PostMapping("/register")
    public ResponseEntity<String> savePerson(@Valid @RequestBody AddPersonDTO personDTO) {
        return ResponseEntity.ok(personService.savePerson(personDTO));
    }

    @PostMapping("/verifyCredentials")
    public ResponseEntity<PersonDTO> verify(@Valid @RequestBody LoginDTO loginDTO) {
        return ResponseEntity.ok(personService.verifyCredentials(loginDTO.document(), loginDTO.password()));
    }



}
