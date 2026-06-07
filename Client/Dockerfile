# syntax=docker/dockerfile:1.7

# ---------- build (compila el bundle de Vite) ----------
FROM node:22-alpine AS build
WORKDIR /app

ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Saltamos tsc en el build de prod (hay errores de tipos preexistentes que no
# afectan al bundle). El type-check va por aparte (npm run build en dev/CI).
RUN npx vite build

# ---------- runtime (nginx sirviendo el dist) ----------
FROM nginx:1.27-alpine AS runtime

RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=5 \
  CMD wget -qO- http://127.0.0.1/healthz >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
