package com.william.cuenta.service;


import com.william.cuenta.infrastructure.dto.AccountDTO;

import java.math.BigInteger;
import java.util.List;

public interface AccountService {


    String createAccount(Long personId, BigInteger balance);

    String sendPayment(Long personId, BigInteger amount, Long creditId);

    String updateBalance(Long personId, BigInteger amount);

    String deleteAccount(Long personId);

    List<AccountDTO> getAllAccounts();

    AccountDTO getAccountById(Long accountId);

    AccountDTO getAccountByPersonId(Long personId);
}
