# Credit Management System - Backend

Sistema de gestión de crédito basado en microservicios con Java Spring Boot. Maneja clientes, cuentas, créditos y autenticación, con foco en seguridad, disponibilidad y escalabilidad.

## Servicios de negocio
- Auth Service (8083): Autenticación/autoriza­ción con JWT (RSA), registro, login y refresh.
- Persona Service: Perfiles de cliente y onboarding.
- Cuenta Service: Cuentas, saldos y transacciones.
- Credito Service: Solicitudes, riesgo, intereses y pagos.

## Infraestructura
- Discovery Server (8761): Eureka para registro y descubrimiento.
- Gateway Service (8090): Spring Cloud Gateway para enrutamiento, balanceo y políticas transversales.

## Arquitectura y patrones
- DDD y Clean Architecture: Controller, Service, Repository y Domain.
- Comunicación: Eureka + LoadBalancer, Feign, Circuit Breaker, API Gateway.
- Seguridad: JWT stateless, claves RSA, Spring Security, context paths por servicio.

## Stack y prácticas
- Java 25, Spring Boot 4.1.1, Spring Cloud 2025.1.3, Maven.
- REST consistente; errores centralizados (@RestControllerAdvice).
- Configuración externalizada (application.properties).
- Monitoring con Actuator (health, info, metrics).

## Comunicación y enrutamiento
- REST/JSON sincrónico con Feign y balanceo por descubrimiento.
- Gateway: rutas por path (/persona/**, /cuenta/**, /credito/**) y resolución por nombre de servicio.

## Estructura
├── auth-service/          # Autenticación y usuarios  
├── persona-service/       # Perfiles de cliente  
├── cuenta-service/        # Cuentas y transacciones  
├── credito-service/       # Créditos y préstamos  
├── discovery-server/      # Eureka  
├── gateway-service/       # API Gateway  
└── frontend/              # Angular SPA

## Despliegue y escalabilidad
- Servicios

## Arquitectura orientada a eventos

El flujo REST sigue disponible para operaciones que necesitan una respuesta inmediata, pero cada cambio de negocio publica un evento JSON en Kafka. Todos los eventos comparten `eventId`, `eventType`, `aggregateId`, `occurredAt` y `payload`.

| Topico | Productor | Eventos principales |
|---|---|---|
| `auth.events` | auth-service | `USER_AUTHENTICATED` |
| `persona.events` | persona-service | `PERSON_CREATED`, `PERSON_UPDATED`, `PERSON_DELETED` |
| `cuenta.events` | cuenta-service | `ACCOUNT_CREATED`, `PAYMENT_DEBITED`, `ACCOUNT_BALANCE_UPDATED`, `ACCOUNT_DELETED` |
| `credito.events` | credito-service | `CREDIT_CREATED`, `CREDIT_PAYMENT_APPLIED`, `CREDIT_CANCELLED` |

Hay consumidores de ejemplo con efecto de negocio: `cuenta-service` elimina una cuenta cuando recibe `PERSON_DELETED`, y `credito-service` cancela créditos pendientes cuando recibe `ACCOUNT_DELETED`. Esto permite extender el sistema con notificaciones, auditoría, scoring y proyecciones sin acoplar los servicios por llamadas REST.

## Infraestructura local

Requisitos: Docker Desktop, Java 25 y Maven. Levanta PostgreSQL, Kafka en modo KRaft y Kafka UI con:

```bash
docker compose up -d
```

- PostgreSQL: `localhost:5432`, base `credito`, usuario `postgres`, clave `admin`
- Kafka: `localhost:9092`
- Kafka UI: `http://localhost:8088`

Para ejecutar los servicios fuera de Docker se usa `localhost:9092` por defecto. En una red Docker, define `KAFKA_BOOTSTRAP_SERVERS=kafka:9092`.

## Front demo:
![Frontend Angular](assets/frontgif.gif)
