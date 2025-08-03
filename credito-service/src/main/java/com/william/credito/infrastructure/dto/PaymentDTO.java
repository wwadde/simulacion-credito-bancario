package com.william.credito.infrastructure.dto;

import lombok.Data;

import java.math.BigInteger;
import java.time.LocalDateTime;

@Data
public class PaymentDTO {

    private Long id;

    private LocalDateTime paymentDate = LocalDateTime.now().withNano(0);

    private String description;

    private BigInteger value;
}
