package com.william.authservice.repository;

import com.william.authservice.domain.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonaRepository extends JpaRepository<Person, Long> {
}
