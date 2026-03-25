# 1. Build Angular
FROM node:24.12.0 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 2. Servir con nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist/agent-ia/browser /usr/share/nginx/html