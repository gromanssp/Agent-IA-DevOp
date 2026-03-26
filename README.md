# Agent-IA-DevOps

> Asistente DevOps conversacional para gestionar infraestructura VPS de CubePath mediante lenguaje natural.

![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![n8n](https://img.shields.io/badge/n8n-Webhook-EA4B71?logo=n8n)
![License](https://img.shields.io/badge/License-MIT-green)

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
| Charts | Chart.js + ng2-charts | 4.3 / 10.0 |
| UI | CSS Custom Properties + Glassmorphism | — |
| Backend | n8n Webhook (AI Agent) | — |
| Testing | Karma + Jasmine | 6.4 / 5.2 |

---

## Arquitectura

```
Usuario (Chat)
    │
    ▼
┌─────────────────────────┐
│  ChatComponent          │  Captura input, renderiza mensajes,
│  (Angular Signals)      │  VPS cards y dialogs de confirmacion
└────────┬────────────────┘
         │ AgentService.sendMessage()
         ▼
┌─────────────────────────┐
│  AgentService           │  Normaliza respuestas de n8n:
│  normalizeResponse()    │  arrays, wrappers {json:}, output strings
└────────┬────────────────┘
         │ HTTP POST
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
│  confirm_required?      │
│  ├─ SI → ConfirmDialog  │
│  └─ NO → VpsCard /      │
│          VpsList         │
└─────────────────────────┘
```

---

## Estructura del proyecto

```
src/app/
├── models/
│   ├── index.ts              # Barrel export
│   ├── enums.ts              # VpsAction, VpsStatus, ChatRole, IpType
│   ├── vps-api.model.ts      # DTOs de la API CubePath (VpsApiItem, VpsPlanDto...)
│   ├── vps.model.ts          # Modelo de dominio (VpsInfo)
│   ├── vps.mapper.ts         # mapVpsApiToInfo(), isVpsApiItem(), isVpsApiList()
│   └── chat.model.ts         # ChatMessage, AgentRequest, AgentResponse
├── services/
│   ├── agent.service.ts      # Comunicacion con n8n + normalizacion
│   ├── theme.service.ts      # Sistema de 12 temas de color
│   └── sidebar.service.ts    # Estado del sidebar
├── pages/
│   ├── chat/                 # Interfaz principal de chat
│   └── not-found/            # Pagina 404
├── layouts/
│   └── dashboard.component   # Layout principal (sidebar + navbar + content)
├── components/
│   ├── sidebar/              # Navegacion colapsable
│   ├── navbar/               # Header con cambio de tema
│   ├── vps-card/             # Card de accion individual
│   ├── vps-list/             # Lista de VPS con detalle completo
│   ├── confirm-dialog/       # Confirmacion de acciones peligrosas
│   └── stat-card/            # Tarjeta de estadisticas
├── shared/components/        # 10 componentes reutilizables
└── directives/               # Tooltip, Collapse
```

---

## Funcionalidades

- **Chat en lenguaje natural** — Gestiona servidores VPS conversando en espanol
- **Deteccion de datos de API** — Reconoce automaticamente respuestas crudas de CubePath y las mapea a modelos de dominio
- **Confirmacion de acciones peligrosas** — Dialogo de seguridad para reboot, delete y power off
- **Lista de VPS** — Visualizacion detallada con IP, plan, ubicacion, OS, CPU, RAM y disco
- **Normalizacion de respuestas** — Maneja arrays anidados, wrappers `{json: ...}` y strings de n8n
- **UI Glassmorphism oscuro** — Estetica moderna con frosted glass y backdrop blur
- **12 temas de color** — 6 navbar oscuro + 6 navbar de color
- **Angular Signals** — Estado reactivo sin Zone.js overhead
- **Standalone Components** — Arquitectura sin NgModules
- **OnPush Change Detection** — Rendimiento optimizado en todos los componentes
- **Componentes reutilizables** — Badge, Modal, Collapse, Progress, Table, Code Snippet, Spinner, Date Picker, Carousel

---

## Variables de entorno

| Variable | Descripcion | Default |
|----------|-------------|---------|
| `n8nWebhookUrl` | URL del webhook de n8n | `/api/webhook-test/devops-agent` |

Configuracion en `src/environments/environment.ts` y `environment.prod.ts`.

---

## Scripts

| Comando | Descripcion |
|---------|-------------|
| `npm start` | Servidor de desarrollo |
| `npm run build` | Build de produccion |
| `npm run watch` | Build en modo watch |
| `npm test` | Ejecutar tests |
