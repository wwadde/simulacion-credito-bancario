package com.william.credito.infrastructure.messaging;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.william.credito.domain.model.Credit;
import com.william.credito.domain.model.Status;
import com.william.credito.infrastructure.dao.CreditDao;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AccountEventListener {

    private final CreditDao creditDao;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "${app.kafka.topics.cuenta}")
    public void onAccountEvent(String message) {
        try {
            JsonNode event = objectMapper.readTree(message);
            if (!"ACCOUNT_DELETED".equals(event.path("eventType").asText())) {
                return;
            }
            Long accountId = event.path("payload").path("accountId").asLong();
            for (Credit credit : creditDao.findByAccountId(accountId)) {
                if (Status.PENDING.getDescription().equals(credit.getStatus())) {
                    credit.setStatus(Status.CANCELED.getDescription());
                    creditDao.save(credit);
                }
            }
            log.info("Pending credits cancelled after ACCOUNT_DELETED event for account {}", accountId);
        } catch (Exception exception) {
            log.error("Could not process account event", exception);
        }
    }
}
