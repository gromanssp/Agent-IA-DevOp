# ============================================
# Stage 1: Build Angular app
# ============================================
FROM node:22-alpine AS build

WORKDIR /app

# Instalar dependencias (cache de capas Docker)
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copiar fuentes (incluye .env que Dokploy inyecta antes del build)
COPY . .

# Instalar gettext para envsubst
RUN apk add --no-cache gettext

# --- Inyectar variables de entorno en environment.ts ---
# Dokploy escribe un .env en el directorio del código antes de hacer docker build.
# Leemos ese .env, exportamos las variables, y envsubst las inyecta en el template.
# Defaults para variables opcionales que podrían no estar en .env
RUN set -a && \
    [ -f .env ] && . .env; \
    export CUBEPATH_API_URL="${CUBEPATH_API_URL:-https://api.cubepath.com/v1/vps/}" && \
    export N8N_WEBHOOK_URL="${N8N_WEBHOOK_URL:-/api/webhook/devops-agent}" && \
    set +a && \
    envsubst < src/environments/environment.template.ts > src/environments/environment.ts && \
    cp src/environments/environment.ts src/environments/environment.prod.ts && \
    echo "=== Generated environment.ts ===" && cat src/environments/environment.ts

# Build de produccion
RUN npx ng build --configuration production

# ============================================
# Stage 2: Servir con Nginx (imagen final limpia)
# ============================================
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/agent-ia/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
