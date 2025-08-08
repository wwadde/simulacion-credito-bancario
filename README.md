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
- Java 21, Spring Boot 3.5.3, Spring Cloud 2025.0.0, Maven.
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

## Front demo:
![Frontend Angular](assets/frontgif.gif)
