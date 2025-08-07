package com.william.credito.infrastructure.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.william.credito.infrastructure.dto.CreateCreditDTO;
import com.william.credito.infrastructure.dto.CreditDTO;
import com.william.credito.service.CreditService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigInteger;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class CreditControllerTest {


    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CreditService creditService;

    @Test
    void getCredit() throws Exception {
        Long personId = 1L;
        CreditDTO creditDTO = new CreditDTO();
        // Configurar creditDTO según sea necesario

        when(creditService.getCredit(personId)).thenReturn(List.of(creditDTO));

        mockMvc.perform(get("/credit/get-credit")
                        .param("PersonaId", String.valueOf(personId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.account").exists());
    }

    @Test
    void createCredit() throws Exception {
        Long personId = 1L;
        CreateCreditDTO createCreditDTO = new CreateCreditDTO();
        // Configurar createCreditDTO según sea necesario

        mockMvc.perform(post("/credit/create-credit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(createCreditDTO))
                        .param("PersonId", String.valueOf(personId)))
                .andExpect(status().isOk())
                .andExpect(content().string("Credit created successfully"));
    }

    @Test
    void sendPayment() throws Exception {
        Long personId = 1L;
        Long creditId = 1L;
        BigInteger amount = BigInteger.valueOf(1000);

        mockMvc.perform(put("/credit/payment")
                        .param("PersonId", String.valueOf(personId))
                        .param("Amount", String.valueOf(amount))
                        .param("CreditId", String.valueOf(creditId)))
                .andExpect(status().isOk())
                .andExpect(content().string("Payment successful"));
    }

    @Test
    void deleteCredit() throws Exception {
        Long personId = 1L;
        Long creditId = 1L;

        mockMvc.perform(delete("/credit/delete-credit")
                        .param("PersonId", String.valueOf(personId))
                        .param("CreditId", String.valueOf(creditId)))
                .andExpect(status().isOk())
                .andExpect(content().string("Credit with id: " + creditId + " cancelled successfully"));
    }

    private static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}