# Sistema de Gestión de Crédito Bancario - Frontend

## 📋 Descripción

Aplicación frontend desarrollada en Angular 20 para gestionar un sistema de crédito bancario que consume microservicios existentes. La aplicación cuenta con autenticación JWT, gestión de personas, cuentas y créditos, todo con una interfaz moderna y responsiva.

## 🚀 Características Principales

### 🔐 Autenticación y Seguridad
- Inicio de sesión con JWT
- Registro de usuarios
- Renovación automática de tokens
- Protección de rutas con guards
- Interceptor automático para adjuntar tokens

### 👥 Gestión de Personas
- Registro de nuevas personas
- Edición de información personal
- Listado con filtros y búsqueda
- Validación de documentos

### 💰 Gestión de Cuentas
- Creación de cuentas bancarias
- Visualización de balances
- Historial de pagos
- Actualización de saldos

### 🏦 Gestión de Créditos
- Visualización de créditos por persona
- Seguimiento de pagos realizados
- Cálculo de progreso de pagos
- Estado y vencimientos

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js 18 o superior
- Angular CLI 20
- Gateway ejecutándose en puerto 8090
- Microservicios backend ejecutándose

### Pasos de Instalación

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Configurar URLs de APIs**
   Verificar las URLs en `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     gatewayUrl: 'http://localhost:8090',
     authApiUrl: 'http://localhost:8090/auth',
     personaApiUrl: 'http://localhost:8090/persona',
     cuentaApiUrl: 'http://localhost:8090/cuenta',
     creditoApiUrl: 'http://localhost:8090/credito'
   };
   ```

3. **Ejecutar la aplicación**
   ```bash
   ng serve
   ```

4. **Abrir en el navegador**
   Navegar a `http://localhost:4200`

## 📡 APIs Consumidas

**Gateway Base URL**: `http://localhost:8090`

### Auth Service (a través del Gateway)
- `POST /auth/api/login` - Iniciar sesión
- `POST /auth/api/refresh-token` - Renovar token
- `POST /auth/api/logout` - Cerrar sesión

### Persona Service (a través del Gateway)
- `POST /persona/public/register` - Registrar persona
- `GET /persona/private/all` - Listar todas las personas
- `PUT /persona/private/update` - Actualizar persona
- `DELETE /persona/private/delete` - Eliminar persona

### Cuenta Service (a través del Gateway)
- `POST /cuenta/api/create-account` - Crear cuenta
- `GET /cuenta/api/all` - Listar todas las cuentas
- `PUT /cuenta/api/update-balance` - Actualizar balance
- `DELETE /cuenta/api/delete-account` - Eliminar cuenta

### Crédito Service (a través del Gateway)
- `POST /credito/api/credits` - Crear crédito
- `GET /credito/api/credits/{personId}` - Obtener crédito
- `DELETE /credito/api/credits/{creditId}` - Eliminar crédito

## 🎨 Diseño y UI

- **Color principal**: Morado (#673ab7)
- **Framework UI**: Angular Material
- **Responsive**: Adaptable a dispositivos móviles
- **Componentes**: Cards, tablas, formularios reactivos, diálogos modales

## 🔒 Seguridad

- **JWT Token**: Almacenamiento seguro en localStorage
- **Guards**: Protección de rutas autenticadas
- **Interceptores**: Adjuntar tokens automáticamente
- **Validación**: Formularios con validación client-side

---

**Nota**: Asegúrese de que el gateway esté ejecutándose en el puerto 8090 y que todos los microservicios backend estén funcionando correctamente antes de usar la aplicación frontend.
