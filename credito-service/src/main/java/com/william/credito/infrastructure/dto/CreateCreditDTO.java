package com.william.credito.infrastructure.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Min;

import lombok.Data;

import java.math.BigInteger;
import java.time.LocalDate;


@Data
public class CreateCreditDTO {

    private BigInteger loan;

    @Min(0)
    private Float interestRate;

    private Integer agreedPayments;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate creditExpirationDate;


}
