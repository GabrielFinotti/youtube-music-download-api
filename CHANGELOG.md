# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.3.0] - 2025-10-11

### ✨ Adicionado

- **Sistema de Logging Profissional com Pino**:
  - Logger estruturado e de alta performance baseado em Pino
  - Logs em formato JSON para ambiente de produção
  - Logs formatados e coloridos para desenvolvimento (pino-pretty)
  - Níveis de log configuráveis via variável de ambiente (TRACE, DEBUG, INFO, WARN, ERROR, FATAL)
  - Middleware HTTP automático para logging de requisições
  - Child loggers com contexto específico por módulo
  - Otimizado para Raspberry Pi 4 e ambientes com recursos limitados
  - Serialização automática de erros com stack traces
  - Timestamps automáticos em ISO 8601

- **Documentação Completa de Logging**:
  - `docs/logging/README.md` - Índice e guia de navegação
  - `docs/logging/overview.md` - Documentação técnica detalhada
  - `docs/logging/quickstart.md` - Guia rápido de início
  - `docs/logging/examples.md` - Exemplos práticos de uso
  - Integração com o README principal

- **Variáveis de Ambiente para Logging**:
  - `LOG_LEVEL` - Configurar nível de log (padrão: 'info')
  - Suporte completo a diferentes níveis por ambiente

### 🔧 Melhorado

- **Performance**:
  - Logger assíncrono não-bloqueante
  - Overhead mínimo (~10x mais rápido que Winston)
  - Uso eficiente de CPU e memória
  - Ideal para Raspberry Pi e dispositivos embarcados

- **Estrutura de Logs**:
  - Logs estruturados facilitam análise e busca
  - Contexto automático por módulo (DownloadService, etc.)
  - Correlação de requisições HTTP
  - Metadados enriquecidos (url, responseTime, statusCode)

- **Developer Experience**:
  - Logs coloridos e formatados em desenvolvimento
  - Logs JSON estruturados em produção
  - Fácil integração com ferramentas de monitoramento
  - Stack traces completos para debugging

### 📝 Documentação

- Adicionada seção sobre Logging no README principal
- Link para documentação completa de logging
- Exemplos de configuração e uso
- Boas práticas de logging

### 🧪 Testes

- Todos os 68 testes continuam passando
- Mantida 100% de cobertura de código
- Sistema de logging integrado aos testes

### 🔗 Integração

- Logger integrado ao DownloadService
- Middleware HTTP para logging automático de requisições
- Suporte a diferentes formatos por ambiente
- Compatible com Docker e ambientes de produção

## [1.2.0] - 2025-10-10

### ✨ Adicionado

- **Suporte Docker Completo**:
  - Dockerfile multi-stage otimizado para produção
  - Imagem final baseada em Alpine Linux (~200MB)
  - Build em duas etapas (builder + production)
  - FFmpeg e Python3 pré-instalados na imagem
  - Health check integrado no container
  - Usuário não-root (nodejs:1001) para segurança

- **Docker Compose**:
  - Arquivo `docker-compose.yml` para orquestração
  - Configuração para integração com rede externa (`proxy_net`)
  - Suporte completo a variáveis de ambiente via arquivo `.env`
  - Health checks configurados (intervalo 30s, timeout 10s, 3 retries)
  - Security options otimizadas (`no-new-privileges`, capabilities mínimas)

- **Scripts Docker no package.json**:
  - `docker:build` - Construir a imagem Docker
  - `docker:up` - Iniciar container em background
  - `docker:down` - Parar e remover container
  - `docker:logs` - Visualizar logs do container
  - `docker:rebuild` - Reconstruir do zero sem cache

- **Arquivo .dockerignore**:
  - Otimização de build excluindo arquivos desnecessários
  - Redução do tamanho da imagem
  - Exclusão de dependências de desenvolvimento
  - Exclusão de arquivos de teste e documentação

### 🔧 Melhorado

- **Segurança do Container**:
  - Execução com usuário não-root
  - Capabilities mínimas (apenas CHOWN, SETGID, SETUID)
  - Security option `no-new-privileges:true`
  - Drop de todas as capabilities por padrão

- **Otimização de Imagem**:
  - Multi-stage build reduz tamanho final
  - Apenas dependências de produção na imagem final
  - Cache otimizado de dependências npm
  - Limpeza de cache npm após instalação

### 📝 Documentação

- Adicionada seção completa sobre Docker no README.md
- Guia de uso com Docker Compose
- Exemplos de comandos Docker manuais
- Documentação de características de segurança
- Explicação detalhada do health check
- Instruções para uso com redes externas
- Atualizado roadmap removendo Docker (implementado)

### 🧪 Testes

- Todos os 68 testes continuam passando
- Mantida 100% de cobertura de código
- Testes compatíveis com ambiente Docker

## [1.1.0] - 2025-10-10

### ✨ Adicionado

- **Headers HTTP Customizados**: Novos headers para informações sobre o áudio baixado
  - `X-Track-Title`: Título original do vídeo do YouTube
  - `X-Track-Duration`: Duração do áudio em segundos
  - `Content-Disposition`: Nome do arquivo formatado para download

### 🔧 Melhorado

- **Configuração CORS**: Headers customizados agora são expostos via `Access-Control-Expose-Headers`
  - Frontend pode acessar título original do vídeo
  - Frontend pode acessar duração do áudio
  - Frontend pode acessar nome do arquivo formatado
- **Documentação**: Adicionado guia completo sobre CORS e headers em `docs/CORS_HEADERS.md`
  - Exemplos de uso com Fetch API
  - Exemplos de uso com Axios
  - Troubleshooting para problemas comuns
  - Explicação detalhada do funcionamento do CORS

### 📝 Atualizado

- README.md com informações sobre os novos headers
- Exemplos de código atualizados com uso dos headers customizados
- Testes atualizados para validar exposição de headers via CORS

### 🧪 Testes

- Adicionado teste para validação da configuração CORS
- 68 testes (66 executados, 2 skipped)
- Mantida 100% de cobertura de código

## [1.0.0] - 2025-10-09

### ✨ Adicionado

#### Funcionalidades Core

- API REST para download de músicas do YouTube
- Conversão automática para MP3 de alta qualidade
- Endpoint `/api/v1/download` para download de áudio
- Validação de URLs do YouTube
- Sanitização de nomes de arquivo
- Sistema de diretórios temporários com limpeza automática

#### Arquitetura

- Padrão Singleton para serviços (`DownloadService`, `EnvConfig`)
- Estrutura em camadas (Controller → Service → Routes)
- Respostas padronizadas com `ApiResponse`
- Tratamento robusto de erros
- Versionamento de API (`/api/v1`)

#### Qualidade e Testes

- **100% de cobertura de testes** em todas as métricas
- 67 testes automatizados (65 executados, 2 skipped)
- Testes unitários para todas as camadas
- Testes de integração para rotas e servidor
- Testes E2E para fluxo completo
- Configuração Jest com thresholds de cobertura

#### Documentação

- README.md completo com exemplos de uso
- Guia de testes abrangente
- Documentação de API com exemplos
- Referência rápida de comandos
- Estrutura de projeto documentada

#### Infraestrutura

- TypeScript com configuração otimizada
- Express.js v5.1.0
- Sistema de variáveis de ambiente com validação
- Hot-reload em desenvolvimento
- Build otimizado para produção
- Formatação automática com Prettier

#### Dependências Principais

- `youtube-dl-exec` v3.0.25 - Download de vídeos
- `@ffmpeg-installer/ffmpeg` v1.1.0 - Processamento de áudio
- `express` v5.1.0 - Framework web
- `dotenv` v17.2.3 - Gerenciamento de ambiente

#### Dependências de Desenvolvimento

- `jest` v30.2.0 - Framework de testes
- `ts-jest` v29.4.4 - Suporte TypeScript para Jest
- `supertest` v7.1.4 - Testes HTTP
- `tsx` v4.20.6 - Execução TypeScript
- `tsup` v8.5.0 - Build otimizado

### 🔒 Segurança

- Validação de entrada para todas as URLs
- Sanitização de nomes de arquivo
- Limpeza automática de arquivos temporários
- Validação de variáveis de ambiente obrigatórias
- Tratamento seguro de erros sem exposição de detalhes internos

### 📊 Performance

- Download paralelo otimizado
- Limpeza automática de recursos
- Gestão eficiente de memória com streams
- Timeout configurável para downloads

### 🎯 Endpoints Implementados

#### Informação

- `GET /` - Informações da API
- `GET /health` - Status de saúde

#### Download

- `GET /api/v1/download` - Download de áudio do YouTube

### 📝 Padrões de Código

- ESM (ECMAScript Modules)
- TypeScript strict mode
- Prettier para formatação consistente
- Organização em camadas (controllers, services, routes, utils)

### 🔧 Configuração

- Suporte a múltiplos ambientes (dev, test, prod)
- Variáveis de ambiente validadas
- CORS configurável
- Porta configurável

---

## [Unreleased]

### 🚧 Planejado

- [ ] Suporte a playlists do YouTube
- [ ] Download de múltiplos formatos (MP3, WAV, FLAC)
- [ ] Sistema de fila para downloads múltiplos
- [ ] Cache de downloads recentes
- [ ] Rate limiting por IP
- [ ] Autenticação JWT
- [ ] Logs estruturados
- [ ] Métricas e monitoramento
- [ ] Docker e Docker Compose
- [ ] CI/CD pipeline
- [ ] Documentação OpenAPI/Swagger

---

## Tipos de Mudanças

- `✨ Adicionado` - Novas funcionalidades
- `🔄 Modificado` - Mudanças em funcionalidades existentes
- `🗑️ Depreciado` - Funcionalidades que serão removidas
- `🔥 Removido` - Funcionalidades removidas
- `🐛 Corrigido` - Correção de bugs
- `🔒 Segurança` - Vulnerabilidades corrigidas
- `📊 Performance` - Melhorias de performance
- `📝 Documentação` - Mudanças na documentação
- `🔧 Configuração` - Mudanças em configurações

---

## Links de Comparação

[Unreleased]: https://github.com/GabrielFinotti/youtube-music-download-api/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/GabrielFinotti/youtube-music-download-api/releases/tag/v1.0.0
