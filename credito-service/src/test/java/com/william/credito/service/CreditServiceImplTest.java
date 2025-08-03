package com.william.credito.service;

import com.william.credito.config.exceptions.CreditException;
import com.william.credito.config.feign.AccountFeign;
import com.william.credito.domain.model.Credit;
import com.william.credito.domain.model.Status;
import com.william.credito.infrastructure.dao.CreditDao;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class CreditServiceImplTest {

    @Mock
    private CreditDao creditDao;

    @Mock
    private AccountFeign feign;

    @InjectMocks
    private CreditServiceImpl creditService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void sendPayment_validPayment() {
        Long personId = 1L;
        Long creditId = 1L;
        BigInteger amount = BigInteger.valueOf(1000);

        Credit credit = new Credit();
        credit.setId(creditId);
        credit.setAmountToPay(amount);
        credit.setStatus(Status.PENDING.getDescription());
        credit.setCreditExpirationDate(LocalDateTime.now().plusDays(1));
        credit.setPaymentsMade(0);
        credit.setAmountPaid(BigInteger.ZERO);
        credit.setLoan(BigInteger.valueOf(10000));
        credit.setInterestRate(5.0f);
        credit.setAgreedPayments(10);

        when(creditDao.creditExists(creditId)).thenReturn(true);
        when(creditDao.findByCreditId(creditId)).thenReturn(Optional.of(credit));
        when(feign.sendPayment(personId, amount, creditId)).thenReturn(ResponseEntity.ok("Payment successful"));

        String response = creditService.sendPayment(personId, amount, creditId);

        assertEquals("Payment successful", response);
        assertEquals(1, credit.getPaymentsMade());
        assertEquals(amount, credit.getAmountPaid());
        assertEquals(Status.PENDING.getDescription(), credit.getStatus());
    }

    @Test
    void sendPayment_invalidAmount() {
        Long personId = 1L;
        Long creditId = 1L;
        BigInteger amount = BigInteger.valueOf(0);

        CreditException exception = assertThrows(CreditException.class, () -> {
            creditService.sendPayment(personId, amount, creditId);
        });

        assertEquals("Amount must be greater than 0", exception.getMessage());
    }
}