package com.william.credito.infrastructure.dao;



import com.william.credito.domain.model.Credit;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
@RequiredArgsConstructor
public class CreditDaoImpl implements CreditDao {

    private final CreditRepository creditRepository;


    @Override
    public List<Credit> findByAccountId(Long id) {
        return creditRepository.findByAccountId(id);
    }

    @Override
    public void save(Credit credit) {
        creditRepository.save(credit);
    }

    @Override
    public Boolean creditExists(Long creditId) {
        return creditRepository.existsById(creditId);
    }

    @Override
    public Optional<Credit> findByCreditId(Long creditId) {
        return creditRepository.findById(creditId);
    }

    @Override
    public Page<Credit> findAll(Pageable pageable) {
        return creditRepository.findAll(pageable);
    }


}
