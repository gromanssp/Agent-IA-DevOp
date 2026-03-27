# ============================================
# Stage 1: Build Angular app
# ============================================
FROM node:22-alpine AS build

WORKDIR /app

# Instalar dependencias (cache de capas Docker)
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copiar fuentes
COPY . .

# --- Inyectar variables de entorno en environment.prod.ts ---
# Dokploy las inyecta como ARG en build-time.
ARG FIREBASE_API_KEY
ARG FIREBASE_AUTH_DOMAIN
ARG FIREBASE_PROJECT_ID
ARG FIREBASE_STORAGE_BUCKET
ARG FIREBASE_MESSAGING_SENDER_ID
ARG FIREBASE_APP_ID
ARG FIREBASE_MEASUREMENT_ID
ARG N8N_WEBHOOK_URL=/api/webhook/devops-agent
ARG CUBEPATH_API_URL=https://api.cubepath.com/v1/vps/

# Generar environment.ts desde el template con los valores reales.
# El proyecto no usa fileReplacements, importa environment.ts directamente.
RUN apk add --no-cache gettext && \
    envsubst < src/environments/environment.template.ts > src/environments/environment.ts && \
    cp src/environments/environment.ts src/environments/environment.prod.ts

# Build de produccion
RUN npx ng build --configuration production

# ============================================
# Stage 2: Servir con Nginx
# ============================================
FROM nginx:alpine

# Limpiar default nginx
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/agent-ia/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
