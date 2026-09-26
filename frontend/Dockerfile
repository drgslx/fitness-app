FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install --package-lock-only --ignore-scripts --no-audit --no-fund \
    && npm ci --no-audit --no-fund

COPY . .
ARG VITE_API_URL=/api/v1
ENV VITE_API_URL=$VITE_API_URL
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_APP_ID
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID

RUN npm run build

FROM nginx:1.27-alpine
LABEL org.opencontainers.image.description="ATHLETICA frontend (Tailwind CSS built with Vite)"
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80