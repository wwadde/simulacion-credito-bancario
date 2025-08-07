package com.william.credito.service;


import com.william.credito.infrastructure.dto.CreateCreditDTO;
import com.william.credito.infrastructure.dto.CreditDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigInteger;
import java.util.List;

public interface CreditService {


    List<CreditDTO> getCredit(Long personaId);


    String createCredit(CreateCreditDTO creditDTO, Long personId);

    String sendPayment(Long personId, BigInteger amount, Long creditId);

    String deleteCredit(Long creditId);

    Page<CreditDTO> getAllCredits(Pageable pageable);
}
