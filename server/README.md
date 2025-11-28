# T1 Component Library - API Server

API REST para tracking de interacciones con componentes de la librería y gestión de usuarios.

## 🛠️ Stack Tecnológico

### Core

| Tecnología     | Versión | Descripción                   |
| -------------- | ------- | ----------------------------- |
| **Node.js**    | 18.x+   | Runtime de JavaScript         |
| **Express.js** | 4.18.2  | Framework web minimalista     |
| **TypeScript** | 5.3.3   | Superset tipado de JavaScript |

### Base de Datos

| Tecnología   | Versión | Descripción         |
| ------------ | ------- | ------------------- |
| **MongoDB**  | Atlas   | Base de datos NoSQL |
| **Mongoose** | 8.0.3   | ODM para MongoDB    |

### Autenticación y Seguridad

| Tecnología             | Versión | Descripción             |
| ---------------------- | ------- | ----------------------- |
| **JWT (jsonwebtoken)** | 9.0.2   | Tokens de autenticación |
| **bcryptjs**           | 2.4.3   | Hash de contraseñas     |

### Utilidades

| Tecnología            | Versión | Descripción            |
| --------------------- | ------- | ---------------------- |
| **cors**              | 2.8.5   | Middleware CORS        |
| **dotenv**            | 16.3.1  | Variables de entorno   |
| **express-validator** | 7.0.1   | Validación de requests |
| **morgan**            | 1.10.0  | Logger HTTP            |

### Desarrollo

| Tecnología      | Versión | Descripción                |
| --------------- | ------- | -------------------------- |
| **ts-node-dev** | 2.0.0   | Hot reload para TypeScript |

## 📁 Estructura del Proyecto

```
server/
├── src/
│   ├── config/
│   │   └── database.ts         # Conexión a MongoDB
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts       # Controlador de autenticación
│   │   └── components.controller.ts # Controlador de tracking
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts       # Verificación de JWT
│   │   ├── error.middleware.ts      # Manejo global de errores
│   │   └── validation.middleware.ts # Validación de requests
│   │
│   ├── models/
│   │   ├── Tracking.model.ts   # Modelo de tracking
│   │   └── User.model.ts       # Modelo de usuario
│   │
│   ├── routes/
│   │   ├── auth.routes.ts      # Rutas de autenticación
│   │   ├── components.routes.ts # Rutas de componentes
│   │   └── index.ts            # Agregador de rutas
│   │
│   ├── services/
│   │   ├── auth.service.ts     # Lógica de autenticación
│   │   └── tracking.service.ts # Lógica de tracking
│   │
│   ├── types/
│   │   └── index.ts            # Tipos e interfaces
│   │
│   ├── utils/
│   │   ├── csvExporter.ts      # Utilidad para exportar CSV
│   │   └── logger.ts           # Logger personalizado
│   │
│   └── app.ts                  # Punto de entrada
│
├── .env                        # Variables de entorno (no commitear)
├── env.example                 # Ejemplo de variables de entorno
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Variables de Entorno

Crea un archivo `.env` copiando el template:

```bash
cp env.example .env
```

### Variables Requeridas

| Variable         | Descripción                    | Ejemplo                                          |
| ---------------- | ------------------------------ | ------------------------------------------------ |
| `PORT`           | Puerto del servidor            | `3001`                                           |
| `NODE_ENV`       | Entorno de ejecución           | `development` \| `production`                    |
| `MONGODB_URI`    | URI de conexión a MongoDB      | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET`     | Clave secreta para firmar JWT  | `mi_clave_secreta_muy_segura`                    |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | `7d`                                             |

### Ejemplo de `.env`

```bash
# Server
PORT=3001
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/component-library?retryWrites=true&w=majority

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
JWT_EXPIRES_IN=7d
```

## 🚀 Instalación y Ejecución

### Requisitos Previos

- Node.js 18.x o superior
- npm 9.x o superior
- Cuenta de MongoDB Atlas (o instancia local de MongoDB)

### Instalación

```bash
# Navegar al directorio del servidor
cd server

# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env
# Editar .env con tus credenciales
```

### Comandos Disponibles

```bash
# Desarrollo (hot reload)
npm run dev

# Construir para producción
npm run build

# Ejecutar versión de producción
npm start

# Ejecutar linter
npm run lint
```

El servidor estará disponible en [http://localhost:3001](http://localhost:3001)

---

## 📡 Documentación de la API

### Base URL

```
http://localhost:3001/api
```

---

## Health Check

### `GET /api/health`

Verifica el estado del servidor y sus servicios.

**Response (200) - Servidor Saludable:**

```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2025-11-27T12:00:00.000Z",
  "uptime": "3600s",
  "services": {
    "database": {
      "status": "connected",
      "connected": true
    }
  },
  "system": {
    "nodeVersion": "v18.19.0",
    "memory": {
      "heapUsed": "45MB",
      "heapTotal": "65MB",
      "rss": "85MB"
    }
  }
}
```

**Response (503) - Servidor Degradado:**

```json
{
  "success": true,
  "status": "degraded",
  "timestamp": "2025-11-27T12:00:00.000Z",
  "uptime": "120s",
  "services": {
    "database": {
      "status": "disconnected",
      "connected": false
    }
  },
  "system": {
    "nodeVersion": "v18.19.0",
    "memory": {
      "heapUsed": "45MB",
      "heapTotal": "65MB",
      "rss": "85MB"
    }
  }
}
```

---

## Autenticación

### `POST /api/auth/register`

Registra un nuevo usuario en el sistema.

**Request Body:**

```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "miPassword123"
}
```

**Response (201) - Éxito:**

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "nombre": "Juan Pérez",
      "email": "juan@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errores:**

| Código | Mensaje                       | Causa                                             |
| ------ | ----------------------------- | ------------------------------------------------- |
| `400`  | `El email ya está registrado` | El email ya existe en la base de datos            |
| `400`  | `Datos inválidos`             | Campos requeridos faltantes o formato inválido    |
| `500`  | `Error interno del servidor`  | Error de base de datos u otro error no controlado |

---

### `POST /api/auth/login`

Inicia sesión de un usuario existente.

**Request Body:**

```json
{
  "email": "juan@example.com",
  "password": "miPassword123"
}
```

**Response (200) - Éxito:**

```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "nombre": "Juan Pérez",
      "email": "juan@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errores:**

| Código | Mensaje                      | Causa                                             |
| ------ | ---------------------------- | ------------------------------------------------- |
| `401`  | `Credenciales inválidas`     | Email no encontrado o contraseña incorrecta       |
| `400`  | `Datos inválidos`            | Campos requeridos faltantes                       |
| `500`  | `Error interno del servidor` | Error de base de datos u otro error no controlado |

---

## Tracking de Componentes

### `POST /api/components/track`

Registra una interacción con un componente. **Endpoint público.**

**Request Body (Usuario Anónimo):**

```json
{
  "nombre": "Button",
  "accion": "click",
  "tipo_usuario": "anonymous"
}
```

**Request Body (Usuario Registrado):**

```json
{
  "nombre": "Modal",
  "accion": "open",
  "tipo_usuario": "registered",
  "usuario": "507f1f77bcf86cd799439011"
}
```

**Campos:**

| Campo          | Tipo   | Requerido | Descripción                                           |
| -------------- | ------ | --------- | ----------------------------------------------------- |
| `nombre`       | string | ✅        | Nombre del componente (Button, Modal, Card, etc.)     |
| `accion`       | string | ✅        | Acción realizada (click, hover, open, close, etc.)    |
| `tipo_usuario` | string | ❌        | `anonymous` (default) o `registered`                  |
| `usuario`      | string | ❌        | ID del usuario (solo si tipo_usuario es `registered`) |

**Response (201) - Éxito:**

```json
{
  "success": true,
  "message": "Interacción registrada",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "nombre": "Button",
    "accion": "click",
    "timestamp": "2025-11-27T12:00:00.000Z",
    "tipo_usuario": "anonymous",
    "__v": 0
  }
}
```

**Errores:**

| Código | Mensaje                      | Causa                              |
| ------ | ---------------------------- | ---------------------------------- |
| `400`  | `Datos inválidos`            | Campo `nombre` o `accion` faltante |
| `500`  | `Error interno del servidor` | Error de base de datos             |

---

### `GET /api/components/stats`

Obtiene estadísticas agregadas de uso de componentes. **Endpoint público.**

**Response (200):**

```json
{
  "success": true,
  "data": {
    "totalInteracciones": 1500,
    "porComponente": [
      { "_id": "Button", "count": 500 },
      { "_id": "Modal", "count": 300 },
      { "_id": "Card", "count": 250 }
    ],
    "porAccion": [
      { "_id": { "componente": "Button", "accion": "click" }, "count": 400 },
      { "_id": { "componente": "Button", "accion": "hover" }, "count": 100 },
      { "_id": { "componente": "Modal", "accion": "open" }, "count": 200 }
    ],
    "porTipoUsuario": [
      { "_id": "anonymous", "count": 1000 },
      { "_id": "registered", "count": 500 }
    ]
  }
}
```

**Errores:**

| Código | Mensaje                      | Causa                  |
| ------ | ---------------------------- | ---------------------- |
| `500`  | `Error interno del servidor` | Error de base de datos |

---

### `GET /api/components/export/view`

Obtiene los datos de tracking paginados para visualización. **Requiere autenticación.**

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

| Parámetro | Tipo   | Default | Descripción                    |
| --------- | ------ | ------- | ------------------------------ |
| `page`    | number | 1       | Número de página               |
| `limit`   | number | 10      | Registros por página (máx: 25) |

**Request:**

```
GET /api/components/export/view?page=1&limit=10
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "nombre_componente": "Button",
      "accion": "click",
      "timestamp": "2025-11-27T12:00:00.000Z",
      "tipo_usuario": "anonymous",
      "nombre_usuario": null
    },
    {
      "id": "507f1f77bcf86cd799439013",
      "nombre_componente": "Modal",
      "accion": "open",
      "timestamp": "2025-11-27T12:01:00.000Z",
      "tipo_usuario": "registered",
      "nombre_usuario": "Juan Pérez"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

**Errores:**

| Código | Mensaje                      | Causa                           |
| ------ | ---------------------------- | ------------------------------- |
| `401`  | `Token no proporcionado`     | Header Authorization faltante   |
| `401`  | `Token inválido`             | Token JWT expirado o malformado |
| `500`  | `Error interno del servidor` | Error de base de datos          |

---

### `GET /api/components/export`

Obtiene todos los datos de tracking para exportación. **Requiere autenticación.**

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "nombre": "Button",
      "accion": "click",
      "timestamp": "2025-11-27T12:00:00.000Z",
      "tipo_usuario": "anonymous",
      "__v": 0
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "nombre": "Modal",
      "accion": "open",
      "timestamp": "2025-11-27T12:01:00.000Z",
      "tipo_usuario": "registered",
      "usuario": {
        "_id": "507f1f77bcf86cd799439011",
        "nombre": "Juan Pérez",
        "email": "juan@example.com"
      },
      "__v": 0
    }
  ]
}
```

**Errores:**

| Código | Mensaje                      | Causa                           |
| ------ | ---------------------------- | ------------------------------- |
| `401`  | `Token no proporcionado`     | Header Authorization faltante   |
| `401`  | `Token inválido`             | Token JWT expirado o malformado |
| `500`  | `Error interno del servidor` | Error de base de datos          |

---

## 🔒 Autenticación

Los endpoints protegidos requieren un token JWT en el header:

```
Authorization: Bearer <token>
```

El token se obtiene al registrarse o hacer login y tiene una validez de **7 días** por defecto (configurable via `JWT_EXPIRES_IN`).

### Flujo de Autenticación

1. El usuario se registra (`POST /api/auth/register`) o inicia sesión (`POST /api/auth/login`)
2. El servidor responde con un token JWT
3. El cliente almacena el token
4. Para endpoints protegidos, el cliente envía el token en el header `Authorization`
5. El servidor valida el token y procesa la solicitud

---

## ⚠️ Códigos de Error Globales

| Código | Descripción                                    |
| ------ | ---------------------------------------------- |
| `200`  | Éxito                                          |
| `201`  | Recurso creado exitosamente                    |
| `400`  | Error de validación / Datos inválidos          |
| `401`  | No autorizado / Token inválido o expirado      |
| `404`  | Recurso no encontrado                          |
| `500`  | Error interno del servidor                     |
| `503`  | Servicio no disponible (database desconectada) |

### Formato de Error

```json
{
  "success": false,
  "message": "Descripción del error",
  "error": "Detalles técnicos (solo en desarrollo)"
}
```

---

## 📝 Ejemplos con cURL

### Registro

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan","email":"juan@test.com","password":"123456"}'
```

### Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@test.com","password":"123456"}'
```

### Registrar Tracking

```bash
curl -X POST http://localhost:3001/api/components/track \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Button","accion":"click","tipo_usuario":"anonymous"}'
```

### Obtener Estadísticas

```bash
curl http://localhost:3001/api/components/stats
```

### Health Check

```bash
curl http://localhost:3001/api/health
```

### Obtener Vista de Exportación (autenticado)

```bash
curl "http://localhost:3001/api/components/export/view?page=1&limit=10" \
  -H "Authorization: Bearer <tu_token>"
```

### Exportar Todos los Datos (autenticado)

```bash
curl http://localhost:3001/api/components/export \
  -H "Authorization: Bearer <tu_token>"
```

---

## 📦 Scripts de npm

| Script  | Comando                                             | Descripción                           |
| ------- | --------------------------------------------------- | ------------------------------------- |
| `dev`   | `ts-node-dev --respawn --transpile-only src/app.ts` | Servidor de desarrollo con hot reload |
| `build` | `tsc`                                               | Compila TypeScript a JavaScript       |
| `start` | `node dist/app.js`                                  | Ejecuta versión compilada             |
| `lint`  | `eslint src/**/*.ts`                                | Analiza código con ESLint             |

---

## 📜 Licencia

ISC
