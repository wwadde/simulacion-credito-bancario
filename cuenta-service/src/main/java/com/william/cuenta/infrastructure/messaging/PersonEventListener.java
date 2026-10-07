package com.william.cuenta.infrastructure.messaging;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.william.cuenta.infrastructure.dao.account.AccountDao;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class PersonEventListener {

    private final AccountDao accountDao;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "${app.kafka.topics.persona}")
    public void onPersonEvent(String message) {
        try {
            JsonNode event = objectMapper.readTree(message);
            if (!"PERSON_DELETED".equals(event.path("eventType").asText())) {
                return;
            }
            Long personId = event.path("payload").path("personId").asLong();
            accountDao.findAccount(personId).ifPresent(account -> {
                accountDao.delete(account);
                log.info("Account {} removed after PERSON_DELETED event", account.getId());
            });
        } catch (Exception exception) {
            log.error("Could not process person event", exception);
        }
    }
}
