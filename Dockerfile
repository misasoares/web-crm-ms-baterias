# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar o código fonte
COPY . .

# Buildar os assets estáticos
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

# Copiar os arquivos estáticos gerados para o diretório do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuração do Nginx para SPA (Single Page Application)
# Redireciona todas as requisições para o index.html para que o React Router funcione
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expor a porta 80
EXPOSE 80

# Iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
