package com.william.persona.infrastructure.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.william.persona.domain.model.DocumentType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AddPersonDTO {

    @NotBlank
    private String name;
    private String surname;
    private String phoneNumber;
    private String address;
    @NotBlank
    @Email
    private String email;
    @NotNull(message = "El tipo de documento es obligatorio")
    private DocumentType documentType;
    @NotBlank
    @Pattern(regexp = "^[A-Z0-9]{6,12}$", message = "Documento debe ser alfanumérico y tener entre 6 y 12 caracteres")
    private String document;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate birthDate;
    private String password;


}
