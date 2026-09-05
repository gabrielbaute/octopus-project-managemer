# Octopus Project Manager

<p align="center">
  <img src="./assets/logo.png" alt="Octopus Project Manager Logo" width="300" />
</p>

Workspace para la gestión de proyectos, subproyectos y tableros kanban.

## Requisitos Previos

* Node.js (v20+ recomendado)
* pnpm (`npm install -g pnpm`)

## Instalación y Configuración Inicial

1. **Instalar dependencias:**
```shell
   pnpm install
```

2. **Aprobar y compilar binarios nativos (SQLite):**
> `better-sqlite3` requiere compilación nativa en Windows. Si es la primera vez que instalas, aprueba el script de construcción y recompila:

```shell
pnpm approve-builds
pnpm rebuild better-sqlite3
```

3. **Iniciar entorno de desarrollo:**
```shell
pnpm dev
```

## Despliegue en Docker

Mediante cli:
```shell
docker run -d \
  -p 8080:8080 \
  -e PORT=8080 \
  -e HOSTNAME=0.0.0.0 \
  -v ./data:/app/data \
  ghcr.io/gabrielbaute/octopus-project-manager:latest
```

O mediante docker compose:
```yml
services:
  octopus-app:
    container_name: octopus-pm
    image: ghcr.io/gabrielbaute/octopus-project-manager:latest
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HOSTNAME=0.0.0.0
      - JWT_SECRET=tu_clave_secreta_super_segura_aqui
      - DATABASE_PATH=/app/data/local.db
    ports:
      - "3000:3000"
    volumes:
      - /opt/octopus-project-manager/data:/app/data
    networks:
      - octopus-network

networks:
  octopus-network:
    name: octopus-network
    driver: bridge
```
