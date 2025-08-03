package com.william.persona.service;

import com.william.persona.config.exceptions.PersonNotFoundException;
import com.william.persona.infrastructure.dao.PersonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class MyUserDetailsService implements UserDetailsService {


    private final PersonRepository personDao;

    @Override
    public UserDetails loadUserByUsername(String document) throws UsernameNotFoundException {
        return personDao.findByDocument(document).orElseThrow(() -> new PersonNotFoundException("Documento no registrado"));
    }
}
