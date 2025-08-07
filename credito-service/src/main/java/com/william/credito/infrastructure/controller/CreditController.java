package com.william.credito.infrastructure.controller;

import com.william.credito.infrastructure.dto.CreateCreditDTO;
import com.william.credito.infrastructure.dto.CreditDTO;
import com.william.credito.infrastructure.dto.PaymentDTO;
import com.william.credito.service.CreditService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/credits")
@RequiredArgsConstructor
public class CreditController {

    private final CreditService service;


    @GetMapping("/{personId}")
    public ResponseEntity<List<CreditDTO>> getCredit(@PathVariable Long personId) {
        return ResponseEntity.ok(service.getCredit(personId));
    }

    @PostMapping
    public ResponseEntity<String> createCredit(@Valid @RequestBody CreateCreditDTO creditDTO,
                                                  @RequestParam Long personId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.createCredit(creditDTO, personId));
    }

    @PostMapping("/{creditId}/payments")
    public ResponseEntity<String> makePayment(@PathVariable Long creditId,
                                              @RequestBody PaymentDTO paymentDTO,
                                              @RequestParam Long personId) {
        return ResponseEntity.ok(service.sendPayment(personId, paymentDTO.getValue(), creditId));
    }

    @DeleteMapping("/{creditId}")
    public ResponseEntity<Void> deleteCredit(@PathVariable Long creditId,
                                             @RequestParam Long personId) {
        service.deleteCredit(creditId);
        return ResponseEntity.noContent().build();
    }
}