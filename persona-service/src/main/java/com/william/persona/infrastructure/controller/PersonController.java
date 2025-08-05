package com.william.persona.infrastructure.controller;

import com.william.persona.config.exceptions.PersonException;
import com.william.persona.infrastructure.dto.EditPersonDTO;
import com.william.persona.infrastructure.dto.PersonDTO;
import com.william.persona.service.PersonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/private")
@RequiredArgsConstructor
public class PersonController {

    private final PersonService personService;

    @GetMapping
    public ResponseEntity<PersonDTO> findPerson(@RequestParam(name = "personaId", required = false) Long id,
                                                @RequestParam(name = "personaDocumento", required = false) String document) {

        if (id == null && document == null) {
            return ResponseEntity.badRequest().build();
        }

        if (id != null) {
            return ResponseEntity.ok(personService.findPerson(id));
        }
        return ResponseEntity.ok(personService.findPerson(document));
    }

    @GetMapping("/all")
    public ResponseEntity<List<PersonDTO>> findAllEntries() {
        return ResponseEntity.ok(personService.findAllEntries());
    }



    @PutMapping("/update")
    public ResponseEntity<String> updatePerson(@RequestBody EditPersonDTO personDTO) {
        return ResponseEntity.ok(personService.updatePerson(personDTO));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deletePerson(@RequestParam(name = "personaId") Long id) {
        return ResponseEntity.ok(personService.deletePerson(id));
    }

}
