package com.william.credito.infrastructure.messaging;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class DomainEventPublisher {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void publish(String topic, String eventType, String aggregateId, Map<String, Object> payload) {
        try {
            String event = objectMapper.writeValueAsString(Map.of(
                    "eventId", UUID.randomUUID().toString(),
                    "eventType", eventType,
                    "aggregateId", aggregateId,
                    "occurredAt", Instant.now().toString(),
                    "payload", payload
            ));
            kafkaTemplate.send(topic, aggregateId, event);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Could not serialize domain event", exception);
        }
    }
}
