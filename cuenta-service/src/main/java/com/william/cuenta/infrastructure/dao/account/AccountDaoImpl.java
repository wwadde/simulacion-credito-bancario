package com.william.cuenta.infrastructure.dao.account;


import com.william.cuenta.config.exceptions.AccountNotFoundException;
import com.william.cuenta.domain.model.Account;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
@RequiredArgsConstructor
public class AccountDaoImpl implements AccountDao {

    private final AccountRepository accountRepository;


    @Override
    public Optional<Account> findAccount(Long personId) {
        return accountRepository.findByPersonId(personId);
    }

    @Override
    public void save(Account account) {
        accountRepository.save(account);
    }

    @Override
    public Boolean existsAccount(Long personId) {
        return accountRepository.existsByPersonId(personId);
    }

    @Override
    public void delete(Account account) {
        accountRepository.delete(account);
    }

    @Override
    public List<Account> findAll() {
        return accountRepository.findAll();
    }

    @Override
    public Account findById(Long accountId) {
        return accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Account with id: " + accountId + " not found"));
    }

    @Override
    public Account findByPersonId(Long personId) {
        return accountRepository.findByPersonId(personId)
                .orElseThrow(() -> new AccountNotFoundException("Account for person with id: " + personId + " not found"));
    }
}
