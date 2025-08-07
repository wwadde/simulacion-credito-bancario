package com.william.credito.infrastructure.dao;



import com.william.credito.domain.model.Credit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface CreditRepository extends JpaRepository<Credit,Long> {


    List<Credit> findByAccountId(Long id);
}
