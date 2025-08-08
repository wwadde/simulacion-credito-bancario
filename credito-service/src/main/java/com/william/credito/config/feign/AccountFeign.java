package com.william.credito.config.feign;


import com.william.credito.infrastructure.dto.AccountDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;

@FeignClient(name = "cuenta-service", path = "/cuenta/api")
public interface AccountFeign {

    @GetMapping("/by-account/{accountId}")
    ResponseEntity<AccountDTO> getAccountById(@PathVariable Long accountId,
                                              @RequestHeader(value = HttpHeaders.AUTHORIZATION) String token);

    @GetMapping("/by-person/{personId}")
    ResponseEntity<AccountDTO> getAccountByPersonId(@PathVariable Long personId,
                                                    @RequestHeader(value = HttpHeaders.AUTHORIZATION) String token);


    @PostMapping("/send-payment")
    ResponseEntity<String> sendPayment(@RequestParam Long personId,
                                       @RequestParam BigInteger amount,
                                       @RequestParam Long creditId,
                                       @RequestHeader(value = HttpHeaders.AUTHORIZATION) String token);

}
