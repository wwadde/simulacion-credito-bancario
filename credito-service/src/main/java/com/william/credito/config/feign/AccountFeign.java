package com.william.credito.config.feign;


import com.william.credito.infrastructure.dto.AccountDTO;
import feign.Headers;
import org.apache.http.Header;
import org.apache.tomcat.util.http.HeaderUtil;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigInteger;

@FeignClient(name = "cuenta-service", path = "/cuenta/api")
public interface AccountFeign {
    @GetMapping
    ResponseEntity<AccountDTO> getAccount(@RequestParam Long personId,
                                          @RequestHeader(value = HttpHeaders.AUTHORIZATION) String token);


    @PostMapping("/send-payment")
    ResponseEntity<String> sendPayment(@RequestParam Long personId,
                                       @RequestParam BigInteger amount,
                                       @RequestParam Long creditId,
                                       @RequestHeader(value = HttpHeaders.AUTHORIZATION) String token);

}
