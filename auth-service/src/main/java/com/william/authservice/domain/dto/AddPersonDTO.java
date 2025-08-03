package com.william.authservice.domain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

public record AddPersonDTO(
        @NotBlank String name,
        String surname,
        String phoneNumber,
        String address,
        @NotBlank
        @Email
        String email,
        @NotNull(message = "El tipo de documento es obligatorio")
        String documentType,
        @NotBlank
        @Pattern(regexp = "^[A-Z0-9]{6,12}$", message = "Documento debe ser alfanumérico y tener entre 6 y 12 caracteres")
        String document,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        LocalDate birthDate,
        String password
) {
}
