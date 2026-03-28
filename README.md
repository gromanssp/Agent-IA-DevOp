# Agent-IA-DevOps

> Asistente DevOps conversacional para gestionar infraestructura VPS de CubePath mediante lenguaje natural.

![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase)
![n8n](https://img.shields.io/badge/n8n-Webhook-EA4B71?logo=n8n)
![Chart.js](https://img.shields.io/badge/Chart.js-4.3-FF6384?logo=chartdotjs)
![Docker](https://img.shields.io/badge/Docker-Swarm-2496ED?logo=docker)

---

## Inicio rapido

```bash
# Instalar dependencias
npm install

# Desarrollo
npm start
# → http://localhost:4200

# Build produccion
npm run build
```

---

## Stack tecnologico

| Categoria | Tecnologia | Version |
|-----------|-----------|---------|
| Framework | Angular | 21.2.4 |
| Lenguaje | TypeScript | 5.9 |
| Reactivo | RxJS | 7.8.0 |
| Autenticacion | Firebase Auth (Google + Email) | 1.x |
| Charts | Chart.js + ng2-charts | 4.3 / 10.0 |
| UI | CSS Custom Properties + Glassmorphism | — |
| Backend | n8n Webhook (AI Agent) | — |
| API | CubePath VPS API | v1 |
| Servidor | Nginx Alpine | — |
| Contenedor | Docker multi-stage build | — |
| Orquestacion | Docker Swarm (via Dokploy) | — |
| Testing | Karma + Jasmine | 6.4 / 5.2 |

---

## Autenticacion

La aplicacion soporta tres metodos de autenticacion:

| Metodo | Descripcion |
|--------|-------------|
| **Google** | Sign-in con cuenta de Google via Firebase Auth (popup) |
| **Email/Password** | Registro e inicio de sesion con email y contrasena via Firebase Auth |

- Las sesiones de Google y Email se gestionan via Firebase `onAuthStateChanged`
- La sesion de CubePath se almacena en `sessionStorage` (se borra al cerrar pestana)
- Rutas protegidas con `authGuard` (redirige a login) y `guestGuard` (redirige a chat)

---

## Arquitectura

```
Usuario (Chat)
    │
    ▼
┌─────────────────────────┐
│  ChatComponent          │  Captura input, renderiza mensajes,
│  (Angular Signals)      │  VPS cards, planes, metricas y confirmaciones
└────────┬────────────────┘
         │ AgentService.sendMessage()
         ▼
┌─────────────────────────┐
│  AgentService           │  Normaliza respuestas de n8n:
│  normalizeResponse()    │  planes, VPS list, VPS single, metricas,
│                         │  wrappers {json:}, output strings
└────────┬────────────────┘
         │ HTTP POST → WebhookModeService.webhookUrl()
         ▼
┌─────────────────────────────────────────┐
│  Nginx proxy (en contenedor)            │
│                                         │
│  /api/webhook/       → n8n produccion   │
│  /api/webhook-test/  → n8n test URL     │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────┐
│  n8n Webhook            │  AI Agent procesa el mensaje,
│  /webhook/devops-agent  │  ejecuta acciones via API CubePath
└────────┬────────────────┘
         │ JSON Response
         ▼
┌─────────────────────────┐
│  Flujo de respuesta     │
│                         │
│  metricsData?           │
│  └─ SI → VpsMetrics     │  Charts CPU, RAM, Disco, Red
│                         │
│  plansData              │
│  └─→ VpsPlans           │  Grid de planes por ubicacion y cluster
│                         │
│  vpsData?               │
│  └─ SI → VpsList        │  Cards con detalle completo
│                         │
│  confirm_required?      │
│  └─ SI → ConfirmDialog  │  Acciones peligrosas o Metricas sin ID
│                         │
│  action?                │
│  └─ SI → VpsCard        │  Badge de accion
└─────────────────────────┘
```

---

## Estructura del proyecto

```
src/app/
├── models/
│   ├── index.ts                    # Barrel export
│   ├── enums.ts                    # VpsAction, VpsStatus, ChatRole, IpType, BadgeVariant
│   ├── vps-api.model.ts            # DTOs de la API CubePath (VpsApiItem...)
│   ├── vps.model.ts                # Modelo de dominio (VpsInfo)
│   ├── vps.mapper.ts               # mapVpsApiToInfo(), isVpsApiItem(), isVpsApiList()
│   ├── vps-metrics-api.model.ts    # DTO de metricas (tuplas [timestamp, value])
│   ├── vps-metrics.model.ts        # Modelo de dominio (VpsMetrics, VpsMetricPoint)
│   ├── vps-metrics.mapper.ts       # mapVpsMetricsApiToMetrics(), isVpsMetricsApi()
│   ├── vps-plans-api.model.ts      # DTO de planes (VpsPlansApiResponse)
│   ├── vps-plans.model.ts          # Modelo de dominio (VpsPlans, VpsPlanLocation...)
│   ├── vps-plans.mapper.ts         # mapVpsPlansApiToPlans(), isVpsPlansApi()
│   └── chat.model.ts               # ChatMessage, AgentRequest, AgentResponse
├── services/
│   ├── agent.service.ts            # Comunicacion con n8n + normalizacion
│   ├── auth.service.ts             # Firebase Auth (Google, Email, CubePath token)
│   ├── webhook-mode.service.ts     # Toggle TEST/PROD — URL dinamica con signal + localStorage
│   ├── response-normalizer.service.ts # Normaliza respuestas crudas de n8n
│   ├── chat-suggestions.service.ts # Comunicacion sidebar → chat (operaciones rapidas)
│   └── sidebar.service.ts          # Estado del sidebar
├── guards/
│   ├── auth.guard.ts               # Protege rutas autenticadas
│   └── guest.guard.ts              # Redirige usuarios logueados
├── interceptors/
│   └── auth.interceptor.ts         # Inyecta token CubePath en requests
├── pages/
│   ├── chat/                       # Interfaz principal de chat
│   ├── login/                      # Login (Google, Email, CubePath)
│   ├── register/                   # Registro con email
│   ├── settings/                   # Configuracion
│   └── not-found/                  # Pagina 404
├── layouts/
│   ├── auth/                       # Layout para login/register
│   └── dashboard/                  # Layout principal (sidebar + navbar + content)
├── components/
│   ├── sidebar/                    # Navegacion colapsable + botones de operaciones
│   ├── navbar/                     # Header con toggle TEST/PROD, avatar, logout
│   ├── vps-card/                   # Card de accion individual
│   ├── vps-list/                   # Lista de VPS con detalle completo
│   ├── vps-metrics/                # Graficas de metricas (CPU, RAM, Disco, Red)
│   ├── vps-plans/                  # Planes de VPS por ubicacion y cluster
│   ├── confirm-dialog/             # Confirmacion de acciones peligrosas
│   └── stat-card/                  # Tarjeta de estadisticas
├── shared/components/              # Componentes reutilizables (Badge, Modal, etc.)
└── directives/                     # Tooltip, Collapse
```

---

## Acciones soportadas

El sidebar incluye botones de acceso rapido para todas las operaciones. Al hacer click, se envia automaticamente el comando al chat:

| Accion | Enum | Descripcion |
|--------|------|-------------|
| Listar VPS | `list_vps` | Muestra todos los servidores con IP, plan, OS, precio |
| Planes VPS | `vps_plans` | Grid de planes disponibles por ubicacion y tipo de cluster |
| Metricas | `metrics` | Graficas de CPU, memoria, disco y red via Chart.js |
| Reiniciar | `reboot` | Reinicio del servidor (requiere confirmacion) |
| Apagar | `power_off` | Apagado del servidor (requiere confirmacion) |
| Encender | `power_on` | Encendido del servidor |

---

## Funcionalidades

- **Chat en lenguaje natural** — Gestiona servidores VPS conversando en espanol
- **Autenticacion multi-metodo** — Google Sign-In, Email/Password y CubePath API Token via Firebase Auth
- **Toggle TEST/PROD** — Boton en la navbar para cambiar entre el webhook de test y produccion de n8n en tiempo real, sin recargar (persiste en `localStorage`)
- **Sidebar con operaciones rapidas** — Botones de acceso directo a todas las acciones VPS disponibles
- **Planes de VPS** — Visualizacion interactiva de planes por ubicacion (Barcelona, Houston, Miami) y tipo de cluster (General Purpose, High Frequency, Dedicated CPU) con precio/hora y precio/mes calculado
- **Metricas en tiempo real** — Graficas de CPU, memoria, disco y red con Chart.js en grid 2x2
- **Deteccion automatica de datos** — Reconoce respuestas de CubePath (planes, VPS list, VPS single, metricas) y las mapea a modelos de dominio
- **Confirmacion de acciones peligrosas** — Dialogo de seguridad para reboot, delete y power off
- **Lista de VPS** — Visualizacion detallada con IP, plan, ubicacion, OS, CPU, RAM, disco y precio
- **Copiado de ID** — Click para copiar el ID del VPS al clipboard con feedback visual
- **Normalizacion de respuestas** — Maneja arrays anidados, wrappers `{json: ...}`, strings de n8n y campos `pending_action`/`confirm_required` como string
- **UI Glassmorphism oscuro** — Estetica moderna con frosted glass y backdrop blur
- **12 temas de color** — 6 navbar oscuro + 6 navbar de color
- **Angular Signals** — Estado reactivo sin Zone.js overhead
- **Standalone Components** — Arquitectura sin NgModules
- **OnPush Change Detection** — Rendimiento optimizado en todos los componentes

---

## Toggle TEST / PROD

La navbar incluye un boton que permite cambiar el destino del webhook de n8n en tiempo real:

| Estado | Color | Endpoint |
|--------|-------|----------|
| **PROD** | Verde | `/api/webhook/devops-agent` |
| **TEST** | Amarillo | `/api/webhook-test/devops-agent` |

- El estado se persiste en `localStorage` (clave `webhook_test_mode`)
- `WebhookModeService` expone un `computed()` signal — el `AgentService` lo lee en cada request
- El cambio es instantaneo, sin recargar la pagina
- Util para probar flujos en n8n con la URL de test antes de activar produccion

---

## API de CubePath

El agente interactua con la [API de CubePath](https://api.cubepath.com/docs) a traves de n8n:

| Endpoint | Metodo | Uso |
|----------|--------|-----|
| `/vps` | GET | Listar todos los VPS |
| `/vps/plans` | GET | Planes disponibles por ubicacion y cluster |
| `/vps/{vps_id}` | GET | Detalle de un VPS |
| `/vps/{vps_id}/metrics` | GET | Metricas (cpu, memory, disk, network) |
| `/vps/{vps_id}/reboot` | POST | Reiniciar servidor |
| `/vps/{vps_id}/power-off` | POST | Apagar servidor |
| `/vps/{vps_id}/power-on` | POST | Encender servidor |

Query params de metricas: `metrics` (comma-separated), `time_range` (1h, 7d, etc.)

---

## Variables de entorno

| Variable | Descripcion | Default produccion |
|----------|-------------|-------------------|
| `N8N_WEBHOOK_URL` | URL del webhook de n8n | `/api/webhook/devops-agent` |
| `CUBEPATH_API_URL` | URL de la API CubePath | `https://api.cubepath.com/v1/vps/` |
| `FIREBASE_API_KEY` | API Key de Firebase | — |
| `FIREBASE_AUTH_DOMAIN` | Auth domain de Firebase | — |
| `FIREBASE_PROJECT_ID` | Project ID de Firebase | — |
| `FIREBASE_STORAGE_BUCKET` | Storage bucket de Firebase | — |
| `FIREBASE_MESSAGING_SENDER_ID` | Sender ID de Firebase | — |
| `FIREBASE_APP_ID` | App ID de Firebase | — |
| `FIREBASE_MEASUREMENT_ID` | Measurement ID de Firebase | — |

En **desarrollo** la configuracion esta en `src/environments/environment.ts`.

En **produccion** el `dockerfile` usa `envsubst` para inyectar estas variables desde el `.env` que Dokploy escribe antes del build (via `src/environments/environment.template.ts`).

El proxy de desarrollo (`proxy.conf.json`) redirige las rutas `/api/` para evitar CORS:

| Ruta local | Destino |
|-----------|---------|
| `/api/webhook/` | `https://vps22899.cubepath.net/webhook/` |
| `/api/webhook-test/` | `https://vps22899.cubepath.net/webhook-test/` |
| `/api/cubepath/` | `https://api.cubepath.com/` |

---

## Despliegue en produccion con Dokploy

### Prerequisitos

- VPS con [Dokploy](https://dokploy.com) instalado (Docker Swarm activado)
- Dominio apuntando al IP publico del VPS DuckDNS.
- Puerto 80 y 443 abiertos en el firewall del proveedor
- Cuenta en Firebase con autenticacion configurada

### 1. Al verificar que Traefik no esta presente

Si creo manualmente un contenedor:

```bash
docker service create \
  --name dokploy-traefik \
  --constraint 'node.role==manager' \
  --mount type=bind,source=/var/run/docker.sock,destination=/var/run/docker.sock \
  --mount type=bind,source=/etc/dokploy/traefik,destination=/etc/dokploy/traefik \
  --publish published=80,target=80,mode=host \
  --publish published=443,target=443,mode=host \
  --network dokploy-network \
  traefik:v3.1 \
  --configFile=/etc/dokploy/traefik/traefik.yml
```

### 2. Crear la aplicacion en Dokploy

1. Ir al panel de Dokploy (`http://IP-VPS:3000`)
2. **Projects → New Project → New Application**
3. Configurar el repositorio:
   - **Provider:** GitHub
   - **Repository:** `gromanssp/Agent-IA-DevOp`
   - **Branch:** `main`
   - **Build Type:** `Dockerfile`
   - **Dockerfile path:** `dockerfile` (sin extension, minusculas)

### 3. Configurar el dominio con SSL

En la aplicacion → **Domains → Add Domain** se aplico:

| Campo | Valor |
|-------|-------|
| **Host** | `agent-ia.duckdns.org` _(sin `https://`)_ |
| **Port** | `80` |
| **HTTPS** | Activado |
| **Certificate** | Let's Encrypt |

### 4. Despliegue

En la aplicacion → **Deploy**. El proceso:

1. Clona el repositorio
3. Ejecuta `docker build` usando el `dockerfile`
4. El `dockerfile` inyecta las variables en `environment.ts` via `envsubst`
5. Compila Angular con `ng build --configuration production`
6. Sirve el bundle con Nginx Alpine

### 5. Agregar dominio en Firebase Auth

Para que Google Sign-In funcione con el dominio de produccion:

1. Ir a [Firebase Console](https://console.firebase.google.com)
2. **Authentication → Settings → Authorized domains**
3. **Add domain:** `tu-dominio.duckdns.org`

---

## Scripts

| Comando | Descripcion |
|---------|-------------|
| `npm start` | Servidor de desarrollo con proxy |
| `npm run build` | Build de produccion |
| `npm run watch` | Build en modo watch |
| `npm test` | Ejecutar tests |
