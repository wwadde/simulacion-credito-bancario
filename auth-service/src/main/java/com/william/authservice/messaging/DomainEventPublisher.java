package com.william.authservice.messaging;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.william.authservice.domain.model.Person;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Component
public class DomainEventPublisher {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public DomainEventPublisher(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

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
        } catch (JacksonException exception) {
            throw new IllegalStateException("Could not serialize domain event", exception);
        }
    }
}
