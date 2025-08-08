# Credit Management System - Backend

## Overview

This project is a comprehensive microservices-based credit management system built with Java Spring Boot. The system provides enterprise-grade functionality for managing customer profiles, bank accounts, credit applications, and secure authentication in a distributed cloud-native architecture. The solution is designed to handle complex financial operations while maintaining high availability, scalability, and security standards.

## Architecture

The backend implements a robust microservices architecture pattern following Domain-Driven Design (DDD) principles. The system is decomposed into bounded contexts, each responsible for a specific business domain:

### Core Business Services

- **Auth Service (Port 8083)**: Implements JWT-based authentication and authorization using Spring Security. Features RSA public/private key encryption for secure token generation and validation, with dedicated endpoints for user registration, login, and token refresh operations.

- **Persona Service**: Manages comprehensive customer information including personal profiles, contact details, and customer onboarding processes. Implements clean architecture patterns with separate controller, service, and repository layers.

- **Cuenta Service**: Handles all bank account operations including account creation, balance management, transaction processing, and account status monitoring. Provides RESTful APIs for account lifecycle management.

- **Credito Service**: Core credit management functionality including credit application processing, risk assessment, interest calculations, payment scheduling, and loan lifecycle management. Implements complex business rules for credit approval workflows.

### Infrastructure Services

- **Discovery Server (Port 8761)**: Netflix Eureka-based service registry that enables dynamic service discovery and registration. Configured as a standalone server that doesn't register with itself, providing centralized service location management.

- **Gateway Service (Port 8090)**: Spring Cloud Gateway implementation that serves as the single entry point for all client requests. Provides intelligent routing based on service names, load balancing through Eureka integration, and centralized cross-cutting concerns like security and monitoring.

## Design Patterns and Architecture Principles

### Clean Architecture Implementation
Each microservice follows clean architecture principles with clear separation of concerns:
- **Controller Layer**: RESTful endpoints handling HTTP requests and responses
- **Service Layer**: Business logic implementation with @Service annotations
- **Repository Layer**: Data access abstraction
- **Domain Layer**: Core business entities and rules

### Service Communication Patterns
- **Service Discovery**: Automatic service registration and discovery through Eureka
- **Load Balancing**: Client-side load balancing using Spring Cloud LoadBalancer
- **Circuit Breaker**: Fault tolerance patterns for resilient inter-service communication
- **API Gateway Pattern**: Centralized routing and request handling

### Security Architecture
- **JWT Token-Based Authentication**: Stateless authentication using JSON Web Tokens
- **RSA Encryption**: Public/private key pairs for secure token signing and verification
- **Spring Security Integration**: Comprehensive security configuration across all services
- **Context Path Security**: Service-specific context paths for enhanced security

## Technology Stack and Best Practices

### Core Technologies
- **Java 21**: Latest LTS version providing modern language features and performance improvements
- **Spring Boot 3.5.3**: Latest framework version with enhanced native compilation support
- **Spring Cloud 2025.0.0**: Modern cloud-native patterns and microservices orchestration
- **Maven**: Dependency management and build automation

### Development Practices
- **Domain-Driven Design**: Business logic organized around domain concepts
- **RESTful API Design**: Consistent HTTP methods and resource naming conventions
- **Exception Handling**: Centralized error handling with @RestControllerAdvice
- **Configuration Management**: Externalized configuration through application.properties
- **Health Monitoring**: Spring Boot Actuator endpoints for service health checks

### Operational Excellence
- **Service Registration**: Automatic service discovery with prefer-ip-address configuration
- **Port Management**: Dedicated ports for each service to avoid conflicts
- **Context Paths**: Service-specific URL contexts for clear API organization
- **Management Endpoints**: Comprehensive monitoring and management capabilities

## Inter-Service Communication

The microservices ecosystem employs several communication patterns:

### Synchronous Communication
- REST APIs with JSON payloads for real-time operations
- Spring Cloud Feign clients for type-safe inter-service calls
- Load-balanced requests through service discovery

### Gateway Routing
The API Gateway implements intelligent routing rules:
- Path-based routing (e.g., /persona/**, /cuenta/**, /credito/**)
- Service name resolution through Eureka discovery
- Load balancing across multiple service instances

## Project Structure and Organization

```
├── auth-service/          # JWT authentication and user management
├── persona-service/       # Customer profile and personal information
├── cuenta-service/        # Bank account operations and management
├── credito-service/       # Credit applications and loan processing
├── discovery-server/      # Eureka service registry
├── gateway-service/       # API Gateway and request routing
└── frontend/             # Angular SPA client application
```

## Deployment and Scalability

Each microservice is independently deployable with its own Maven configuration, allowing for:
- **Independent Scaling**: Services can be scaled based on individual load requirements
- **Technology Diversity**: Future services can adopt different technology stacks if needed
- **Fault Isolation**: Failures in one service don't cascade to others
- **Continuous Deployment**: Services can be updated independently without system-wide downtime

The architecture supports horizontal scaling through load balancer integration and service discovery, making it suitable for enterprise-level deployments with high availability requirements.
