# Build stage
FROM node:20-alpine AS builder

# Instalar dependências necessárias para compilação
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar todas as dependências (incluindo dev)
RUN npm install

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Production stage
FROM node:20-alpine

# Instalar ffmpeg (necessário para o youtube-dl-exec)
RUN apk add --no-cache ffmpeg python3

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm install --omit=dev && \
    npm cache clean --force

# Copiar código compilado do builder
COPY --from=builder /app/dist ./dist

# Copiar arquivos necessários
COPY --from=builder /app/node_modules/@ffmpeg-installer ./node_modules/@ffmpeg-installer

# Mudar ownership para usuário não-root
RUN chown -R nodejs:nodejs /app

# Usar usuário não-root
USER nodejs

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/v1/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando para iniciar a aplicação
CMD ["node", "dist/server.js"]
