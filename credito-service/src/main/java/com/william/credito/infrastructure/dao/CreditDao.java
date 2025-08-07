package com.william.credito.infrastructure.dao;


import com.william.credito.domain.model.Credit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;


public interface CreditDao {


    List<Credit> findByAccountId(Long id);

    void save(Credit credit);

    Boolean creditExists(Long creditId);

    Optional<Credit> findByCreditId(Long creditId);

    Page<Credit> findAll(Pageable pageable);
}
