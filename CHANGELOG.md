# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

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
