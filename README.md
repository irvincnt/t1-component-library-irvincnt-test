# T1 Component Library

Sistema completo de showcase de componentes con tracking de interacciones. Incluye una aplicación web cliente desarrollada en Next.js y un servidor API REST en Express.

## 📋 Descripción General

Este proyecto permite:

- 🎨 Visualizar y probar componentes de una librería UI
- 📊 Registrar interacciones de usuarios con los componentes
- 📈 Visualizar estadísticas de uso
- 📁 Exportar datos de tracking
- 👤 Sistema de autenticación de usuarios

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE                               │
│                     (Next.js 16)                            │
│                                                              │
│  ┌─────────┐  ┌──────────┐  ┌─────────┐  ┌──────────────┐  │
│  │ Showcase│  │Dashboard │  │  Docs   │  │   Exports    │  │
│  │   Page  │  │   Page   │  │  Page   │  │    Page      │  │
│  └────┬────┘  └────┬─────┘  └────┬────┘  └──────┬───────┘  │
│       │            │             │              │           │
│       └────────────┴─────────────┴──────────────┘           │
│                           │                                  │
│                    ┌──────┴──────┐                          │
│                    │  API Client │                          │
│                    │  (lib/api)  │                          │
│                    └──────┬──────┘                          │
└───────────────────────────┼─────────────────────────────────┘
                            │ HTTP/REST
                            ▼
┌───────────────────────────┼─────────────────────────────────┐
│                        SERVIDOR                              │
│                     (Express.js)                             │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                     Routes                           │   │
│  │  /api/health  /api/auth/*  /api/components/*        │   │
│  └─────────────────────────┬───────────────────────────┘   │
│                            │                                │
│  ┌─────────────────────────┴───────────────────────────┐   │
│  │                  Controllers                         │   │
│  └─────────────────────────┬───────────────────────────┘   │
│                            │                                │
│  ┌─────────────────────────┴───────────────────────────┐   │
│  │                   Services                           │   │
│  │            (auth.service, tracking.service)          │   │
│  └─────────────────────────┬───────────────────────────┘   │
│                            │                                │
│  ┌─────────────────────────┴───────────────────────────┐   │
│  │                MongoDB (Mongoose)                    │   │
│  │           (Users, Tracking collections)              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

| Requisito | Versión Mínima | Verificar Instalación |
| --------- | -------------- | --------------------- |
| Node.js   | 18.x           | `node --version`      |
| npm       | 9.x            | `npm --version`       |
| Git       | 2.x            | `git --version`       |

También necesitarás:

- Una cuenta de **MongoDB Atlas** (gratuita)

## 🚀 Guía de Instalación Paso a Paso

### Paso 1: Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd t1-component-libray-irvincnt-test
```

### Paso 2: Configurar el Servidor

#### 2.1 Navegar al directorio del servidor

```bash
cd server
```

#### 2.2 Instalar dependencias

```bash
npm install
```

#### 2.3 Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp env.example .env
```

#### 2.4 Editar el archivo `.env`

Abre el archivo `server/.env` en tu editor y configura:

```bash
# Server
PORT=3001
NODE_ENV=development

# MongoDB - Reemplaza con tu URI de MongoDB Atlas
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# JWT - Usa una clave secreta segura
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
JWT_EXPIRES_IN=7d
```

> ⚠️ **Importante:** Nunca compartas tu archivo `.env` ni lo subas a control de versiones.

#### 2.5 Iniciar el servidor

```bash
npm run dev
```

Deberías ver:

```
🚀 Servidor corriendo en http://localhost:3001
📚 Health check: http://localhost:3001/api/health
```

#### 2.6 Verificar que el servidor funciona

Abre otra terminal y ejecuta:

```bash
curl http://localhost:3001/api/health
```

Deberías recibir una respuesta JSON con `"status": "healthy"`.

---

### Paso 3: Configurar el Cliente

#### 3.1 Abrir una nueva terminal y navegar al directorio del cliente

```bash
cd client
```

#### 3.2 Instalar dependencias

```bash
npm install
```

#### 3.3 Configurar variables de entorno (opcional)

Crea un archivo `.env.local` si necesitas cambiar la URL del API:

```bash
# Por defecto apunta a localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

#### 3.4 Iniciar el cliente

```bash
npm run dev
```

Deberías ver:

```
▲ Next.js 16.0.4
- Local:        http://localhost:3000
```

#### 3.5 Abrir la aplicación

Abre tu navegador en [http://localhost:3000](http://localhost:3000)

---

## ✅ Verificación de la Instalación

### Checklist

- [ ] El servidor responde en `http://localhost:3001/api/health`
- [ ] El cliente carga en `http://localhost:3000`
- [ ] La página de estado (`http://localhost:3000/status`) muestra el servidor como "healthy"
- [ ] Puedes registrar un usuario en `http://localhost:3000/register`
- [ ] Puedes iniciar sesión en `http://localhost:3000/login`

---

## 🔄 Comandos Útiles

### Servidor (`/server`)

```bash
# Desarrollo con hot reload
npm run dev

# Compilar para producción
npm run build

# Ejecutar versión de producción
npm start

# Linter
npm run lint
```

### Cliente (`/client`)

```bash
# Desarrollo con hot reload
npm run dev

# Compilar para producción
npm run build

# Ejecutar versión de producción
npm start

# Linter
npm run lint

# Tests
npm test

# Tests con cobertura
npm run test:coverage
```

---

## 📁 Estructura del Proyecto

```
t1-component-libray-irvincnt-test/
│
├── client/                 # Aplicación frontend (Next.js)
│   ├── app/                # Páginas y componentes
│   ├── coverage/           # Reportes de cobertura
│   ├── public/             # Archivos estáticos
│   ├── package.json
│   └── README.md           # Documentación del cliente
│
├── server/                 # API backend (Express)
│   ├── src/                # Código fuente
│   ├── env.example         # Template de variables de entorno
│   ├── package.json
│   └── README.md           # Documentación del servidor
│
├── .gitignore
└── README.md               # Este archivo
```

---

## 📚 Documentación Adicional

- [📘 README del Cliente](./client/README.md) - Stack, estructura y testing del frontend
- [📗 README del Servidor](./server/README.md) - API documentation y endpoints

---

## 🔧 Desarrollo

### Ejecutar Todo el Stack (2 terminales)

**Terminal 1 - Servidor:**

```bash
cd server
npm run dev
```

**Terminal 2 - Cliente:**

```bash
cd client
npm run dev
```

### Ejecutar Tests

```bash
cd client
npm run test:coverage
```

---

## 📜 Licencia

ISC

---

## 👥 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request
