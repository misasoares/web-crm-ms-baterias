# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar dependências
COPY package*.json ./

# Instalar
RUN npm ci

# Copiar código
COPY . .



# Buildar (Agora o Vite vai ler a variável acima e "queimar" no código JS)
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

# Copiar arquivos do build
COPY --from=builder /app/dist /usr/share/nginx/html

# Config Nginx para SPA
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]