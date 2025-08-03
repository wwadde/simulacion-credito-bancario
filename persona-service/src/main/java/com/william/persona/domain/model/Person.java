package com.william.persona.domain.model;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;


import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "personas")
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Person implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "nombre")
    private String name;

    @Column(name = "apellido")
    private String surname;

    @Column(name = "direccion")
    private String address;

    @Column(name = "telefono")
    private String phoneNumber;

    @Column(name = "email")
    private String email;

    @Column(name = "tipo_documento")
    @Enumerated(EnumType.STRING)
    private DocumentType documentType;

    @Column(name = "numero_documento", unique = true)
    private String document;

    @Column(name = "fecha_nacimiento")
    private LocalDate birthDate;

    @Column(name = "estado")
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "password")
    private String password;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getUsername() {
        return this.name;
    }
}
