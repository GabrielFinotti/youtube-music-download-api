<div align="center">

# 🎵 YTune API

### API REST moderna para download de músicas do YouTube

[![Version](https://img.shields.io/badge/version-1.3.2-blue.svg)](https://github.com/GabrielFinotti/youtube-music-download-api)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](https://github.com/GabrielFinotti/youtube-music-download-api)

[Características](#-características) •
[Instalação](#-instalação) •
[Docker](#-docker) •
[Logging](#-logging) •
[API](#-api) •
[Exemplos](#-exemplos) •
[Testes](#-testes) •
[CORS & Headers](docs/CORS_HEADERS.md) •
[Changelog](#-changelog)

</div>

---

## 📋 Sobre

**YTune API** é uma API REST robusta e moderna desenvolvida com **Node.js** e **TypeScript** para download e conversão de áudios do YouTube para formato MP3 de alta qualidade. Com arquitetura em camadas, testes automatizados completos e 100% de cobertura de código.

### 🎯 Características

- ✅ **Download de Áudio do YouTube** - Extração de áudio de vídeos
- ✅ **Conversão MP3** - Conversão automática para formato MP3
- ✅ **Headers Customizados** - Metadados do áudio (título, duração) via HTTP headers
- ✅ **CORS Configurável** - Headers expostos para acesso cross-origin
- ✅ **Logging Profissional** - Sistema de logs estruturado com Pino
- ✅ **API RESTful** - Endpoints bem definidos e versionados
- ✅ **TypeScript** - Código totalmente tipado e seguro
- ✅ **100% Cobertura de Testes** - 68 testes automatizados
- ✅ **Arquitetura em Camadas** - Controller → Service → Routes
- ✅ **Respostas Padronizadas** - Formato consistente de resposta
- ✅ **Validação Robusta** - Validação de URLs e parâmetros
- ✅ **Sanitização** - Nomes de arquivo seguros
- ✅ **Limpeza Automática** - Gestão inteligente de arquivos temporários com UUID
- ✅ **Processamento Concorrente** - Suporte para múltiplas requisições simultâneas
- ✅ **Docker Ready** - Suporte completo para containers

---

## 🚀 Stack Tecnológica

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **Node.js** | 18+ | Runtime JavaScript |
| **TypeScript** | 5.9.3 | Superset com tipagem estática |
| **Express** | 5.1.0 | Framework web minimalista |
| **Pino** | 10.0.0 | Logger estruturado de alta performance |
| **youtube-dl-exec** | 3.0.25 | Download de vídeos do YouTube |
| **FFmpeg** | 1.1.0 | Processamento e conversão de áudio |
| **Jest** | 30.2.0 | Framework de testes |
| **Supertest** | 7.1.4 | Testes HTTP |
| **ts-jest** | 29.4.4 | Suporte TypeScript para Jest |

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18 ou superior ([Download](https://nodejs.org/))
- **npm** ou **yarn**
- **FFmpeg** (necessário para conversão de áudio)

### Instalação do FFmpeg

#### Ubuntu/Debian

```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

#### macOS

```bash
brew install ffmpeg
```

#### Windows

1. Baixe o FFmpeg de [ffmpeg.org](https://ffmpeg.org/download.html)
2. Extraia o arquivo
3. Adicione o diretório `bin` ao PATH do sistema

---

## 🔧 Instalação

### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/GabrielFinotti/youtube-music-download-api.git
cd youtube-music-download-api
```

### 2️⃣ Instale as Dependências

```bash
npm install
# ou
yarn install
```

### 3️⃣ Configure as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o arquivo `.env` conforme necessário:

```env
NODE_ENV=development
PORT=3000
CORS=*
VERSION=v1
LOG_LEVEL=info
SECRET_KEY=your-secret-key-here
```

### 4️⃣ Inicie o Servidor

**Modo Desenvolvimento:**

```bash
npm run dev
```

**Modo Produção:**

```bash
npm run build
npm start
```

O servidor estará rodando em `http://localhost:3000` 🚀

---

## 🐳 Docker

A aplicação possui suporte completo para Docker, incluindo multi-stage builds, otimizações de segurança e health checks.

### 🚢 Construir e Executar com Docker Compose

A forma mais simples de executar a aplicação é usando Docker Compose:

```bash
# Construir a imagem
npm run docker:build

# Iniciar o container
npm run docker:up

# Ver logs
npm run docker:logs

# Parar o container
npm run docker:down

# Reconstruir do zero (sem cache)
npm run docker:rebuild
```

### 📦 Docker Manual

**Construir a imagem:**

```bash
docker build -t ytune-api:latest .
```

**Executar o container:**

```bash
docker run -d \
  --name ytune-api \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e CORS=* \
  -e VERSION=v1 \
  -e LOG_LEVEL=info \
  -e SECRET_KEY=your-secret-key \
  ytune-api:latest
```

**Verificar logs:**

```bash
docker logs -f ytune-api
```

**Parar e remover:**

```bash
docker stop ytune-api
docker rm ytune-api
```

### 🔒 Características de Segurança do Docker

- ✅ **Multi-stage builds** - Imagem final otimizada e menor
- ✅ **Usuário não-root** - Execução com usuário `nodejs` (UID 1001)
- ✅ **Capabilities mínimas** - Apenas permissões essenciais
- ✅ **Health checks** - Monitoramento automático de saúde
- ✅ **Security options** - `no-new-privileges:true`
- ✅ **Imagem Alpine** - Base mínima e segura

### 📊 Detalhes da Imagem Docker

| Característica | Valor |
|----------------|-------|
| **Imagem Base** | `node:20-alpine` |
| **Tamanho Final** | ~200MB |
| **Porta Exposta** | 3000 |
| **Health Check** | A cada 30s |
| **Usuário** | `nodejs` (non-root) |

### 🔍 Health Check

O container possui um health check integrado que verifica o endpoint `/api/v1/health`:

```yaml
healthcheck:
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

**Verificar status:**

```bash
docker inspect --format='{{.State.Health.Status}}' ytune-api
```

### 🌐 Docker Compose com Rede Externa

O `docker-compose.yml` está configurado para usar uma rede externa chamada `proxy_net`. Isso permite integração com reverse proxies como Traefik ou Nginx.

**Criar a rede (se ainda não existir):**

```bash
docker network create proxy_net
```

### 📝 Variáveis de Ambiente no Docker

Crie um arquivo `.env` na raiz do projeto:

```env
NODE_ENV=production
PORT=3000
CORS=*
VERSION=v1
LOG_LEVEL=info
SECRET_KEY=your-secret-key-here
```

O Docker Compose lerá automaticamente essas variáveis.

---

## 📝 Logging

A YTune API possui um sistema de logging profissional baseado em **Pino**, otimizado para alta performance e ambientes com recursos limitados como Raspberry Pi 4.

### 🎯 Características do Sistema de Logging

- ✅ **Alta Performance** - ~10x mais rápido que Winston
- ✅ **Logs Estruturados** - Formato JSON para produção
- ✅ **Logs Formatados** - Coloridos e legíveis em desenvolvimento
- ✅ **Logging Condicional** - Formato adaptado automaticamente ao ambiente
- ✅ **Níveis Configuráveis** - TRACE, DEBUG, INFO, WARN, ERROR, FATAL
- ✅ **Middleware HTTP** - Logging automático de requisições
- ✅ **Child Loggers** - Contexto específico por módulo
- ✅ **Otimizado para RPi** - Mínimo uso de CPU e memória
- ✅ **Docker Ready** - Funciona perfeitamente em containers

### ⚙️ Configuração

Configure o nível de log através da variável de ambiente `LOG_LEVEL`:

```env
# .env
LOG_LEVEL=info  # trace, debug, info, warn, error, fatal
```

### 📊 Formato dos Logs

O sistema de logging adapta automaticamente o formato baseado no ambiente (`NODE_ENV`):

**Desenvolvimento (legível e colorido com pino-pretty):**

```
[15:30:45.123] INFO (DownloadService): Iniciando processo de download
    url: "https://www.youtube.com/watch?v=..."
```

**Produção/Docker (JSON estruturado - alta performance):**

```json
{
  "level": 30,
  "time": "14/10/2025 15:30:45",
  "context": "DownloadService",
  "msg": "Iniciando processo de download",
  "url": "https://www.youtube.com/watch?v=..."
}
```

> **💡 Nota**: Em produção, o logger usa JSON nativo do Pino (sem `pino-pretty`) para máxima performance e compatibilidade com ferramentas de agregação de logs como ELK Stack, Grafana Loki, Datadog, etc.

### 🔗 Documentação Completa

Para guias detalhados, exemplos práticos e melhores práticas, consulte a documentação completa de logging:

📚 **[Documentação de Logging](docs/logging/README.md)**

- [Overview](docs/logging/overview.md) - Documentação técnica completa
- [Quickstart](docs/logging/quickstart.md) - Guia rápido de início
- [Examples](docs/logging/examples.md) - Exemplos práticos de uso

### 💡 Exemplo de Uso

Logs são gerados automaticamente para:

- ✅ Requisições HTTP (método, URL, status, tempo de resposta)
- ✅ Processos de download (início, progresso, conclusão)
- ✅ Erros e exceções (com stack traces completos)
- ✅ Validações e sanitizações
- ✅ Limpeza de arquivos temporários

---

## 🎯 Scripts Disponíveis

```bash
# 🔨 Desenvolvimento
npm run dev              # Inicia servidor em modo desenvolvimento (hot-reload)

# 🏗️ Build
npm run build            # Compila TypeScript para JavaScript

# 🚀 Produção
npm start                # Inicia servidor em produção

# 🧪 Testes
npm test                 # Executa todos os testes
npm run test:watch       # Executa testes em modo watch
npm run test:coverage    # Executa testes com relatório de cobertura

# ✨ Formatação
npm run format           # Formata código com Prettier
npm run format:check     # Verifica formatação do código

# 🐳 Docker
npm run docker:build     # Constrói a imagem Docker
npm run docker:up        # Inicia o container em background
npm run docker:down      # Para e remove o container
npm run docker:logs      # Exibe logs do container
npm run docker:rebuild   # Reconstrói do zero (sem cache)
```

---

## � API

### Base URL

```text
http://localhost:3000
```

### Versionamento

A API usa versionamento por URL. A versão atual é **v1**.

**Formato:** `/api/{version}/{resource}`

### Padrão de Respostas

Todas as respostas seguem um formato padronizado:

#### ✅ Sucesso

```json
{
  "success": true,
  "status": 200,
  "message": "Mensagem descritiva",
  "data": {
    // Dados da resposta
  }
}
```

#### ❌ Erro

```json
{
  "success": false,
  "status": 400 | 404 | 500,
  "message": "Mensagem de erro descritiva",
  "error": {
    "details": "Detalhes adicionais (opcional)"
  }
}
```

### Códigos de Status HTTP

| Código | Descrição | Uso |
|--------|-----------|-----|
| `200` | OK | Requisição bem-sucedida |
| `400` | Bad Request | Parâmetros inválidos ou ausentes |
| `404` | Not Found | Recurso não encontrado |
| `500` | Internal Server Error | Erro interno do servidor |

---

## 🔌 Endpoints

### 📌 Health Check

#### `GET /health`

Verifica o status de saúde da API.

**Resposta:**

```json
{
  "status": "ok",
  "timestamp": "2025-10-09T12:00:00.000Z"
}
```

**Exemplo:**

```bash
curl http://localhost:3000/health
```

---

### 🎵 Download de Áudio

#### `GET /api/v1/download`

Faz o download de áudio de um vídeo do YouTube e retorna o buffer do arquivo MP3.

**Query Parameters:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `url` | `string` | ✅ Sim | URL válida do YouTube |

**Validações:**

- ✅ URL deve ser fornecida
- ✅ URL deve ser uma string
- ✅ URL deve ser do YouTube (`youtube.com` ou `youtu.be`)
- ✅ URL não pode ser de playlist

**Headers de Resposta:**

```text
Content-Type: audio/mpeg
Content-Disposition: attachment; filename*=UTF-8''<nome-do-arquivo>.mp3
Content-Length: <tamanho-do-arquivo>
X-Track-Title: <titulo-original-do-video>
X-Track-Filename: <nome-do-arquivo-formatado>.mp3
X-Track-Duration: <duracao-em-segundos>
```

> **📝 Nota sobre os Headers:**
>
> - `X-Track-Title`: Contém o título original do vídeo (pode ter caracteres especiais)
> - `X-Track-Filename`: Contém o nome do arquivo sanitizado e formatado, pronto para ser usado como nome de arquivo no frontend
> - `X-Track-Duration`: Duração do áudio em segundos
> - Todos os valores são codificados com `encodeURIComponent` para garantir compatibilidade

**Exemplo - cURL:**

```bash
curl -X GET \
  "http://localhost:3000/api/v1/download?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ" \
  --output musica.mp3
```

**Respostas:**

<details>
<summary><b>✅ 200 - Sucesso</b></summary>

**Headers:**

```text
Content-Type: audio/mpeg
Content-Disposition: attachment; filename*=UTF-8''Rick%20Astley%20-%20Never%20Gonna%20Give%20You%20Up.mp3
```

**Body:** Buffer binário do arquivo MP3

</details>

<details>
<summary><b>❌ 400 - URL não fornecida</b></summary>

```json
{
  "success": false,
  "status": 400,
  "message": "URL do YouTube é obrigatória"
}
```

</details>

<details>
<summary><b>❌ 400 - URL inválida</b></summary>

```json
{
  "success": false,
  "status": 400,
  "message": "URL do YouTube inválida"
}
```

</details>

<details>
<summary><b>❌ 400 - URL de playlist</b></summary>

```json
{
  "success": false,
  "status": 400,
  "message": "URLs de playlist não são suportadas. Por favor, forneça uma URL de vídeo individual"
}
```

</details>

<details>
<summary><b>❌ 500 - Erro no servidor</b></summary>

```json
{
  "success": false,
  "status": 500,
  "message": "Erro ao processar o download",
  "error": {
    "details": "Detalhes do erro"
  }
}
```

</details>

---

## � Exemplos de Uso

### 1. cURL

```bash
# Download simples
curl -X GET \
  "http://localhost:3000/api/v1/download?url=https://youtu.be/dQw4w9WgXcQ" \
  --output musica.mp3

# Com verbose para debug
curl -v -X GET \
  "http://localhost:3000/api/v1/download?url=https://youtu.be/dQw4w9WgXcQ" \
  --output musica.mp3
```

### 2. JavaScript (Fetch API)

```javascript
async function downloadYouTubeAudio(url) {
  const apiUrl = `http://localhost:3000/api/v1/download?url=${encodeURIComponent(url)}`;
  
  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    
    // Extrair informações dos headers customizados
    const filename = decodeURIComponent(response.headers.get('X-Track-Filename') || 'audio.mp3');
    const title = decodeURIComponent(response.headers.get('X-Track-Title') || 'Sem título');
    const duration = response.headers.get('X-Track-Duration');
    
    console.log(`📝 Título: ${title}`);
    console.log(`⏱️  Duração: ${duration}s`);
    console.log(`📄 Nome do arquivo: ${filename}`);
    
    // Download do arquivo
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename; // Usa o nome formatado do servidor
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
    
    console.log('✅ Download concluído!');
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

// Uso
downloadYouTubeAudio('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
```

### 3. Node.js (Axios)

```javascript
import axios from 'axios';
import fs from 'fs';

async function downloadAudio(youtubeUrl) {
  try {
    const response = await axios.get('http://localhost:3000/api/v1/download', {
      params: { url: youtubeUrl },
      responseType: 'arraybuffer'
    });

    // Extrair informações dos headers customizados
    const filename = decodeURIComponent(response.headers['x-track-filename'] || 'audio.mp3');
    const title = decodeURIComponent(response.headers['x-track-title'] || 'Sem título');
    const duration = response.headers['x-track-duration'];
    
    console.log(`📝 Título: ${title}`);
    console.log(`⏱️  Duração: ${duration}s`);
    console.log(`📄 Nome do arquivo: ${filename}`);

    // Salvar o arquivo com o nome formatado
    fs.writeFileSync(filename, response.data);
    console.log(`✅ Download concluído: ${filename}`);
  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
  }
}

downloadAudio('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
```

### 4. TypeScript

```typescript
import axios, { AxiosResponse } from 'axios';
import * as fs from 'fs';

interface DownloadOptions {
  url: string;
  outputPath?: string;
}

async function downloadAudio({ url, outputPath = 'output.mp3' }: DownloadOptions): Promise<void> {
  try {
    const response: AxiosResponse<ArrayBuffer> = await axios.get(
      'http://localhost:3000/api/v1/download',
      {
        params: { url },
        responseType: 'arraybuffer',
        headers: {
          'Accept': 'audio/mpeg'
        }
      }
    );

    fs.writeFileSync(outputPath, Buffer.from(response.data));
    console.log(`✅ Download concluído: ${outputPath}`);
    
  } catch (error: any) {
    if (error.response) {
      console.error(`❌ Erro: ${error.response.data}`);
    } else {
      console.error('❌ Erro:', error.message);
    }
  }
}

// Uso
downloadAudio({ 
  url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  outputPath: 'minha-musica.mp3'
});
```

### 5. Python

```python
import requests

def download_audio(youtube_url, output_path='musica.mp3'):
    """
    Faz download de áudio do YouTube
    
    Args:
        youtube_url: URL do vídeo do YouTube
        output_path: Caminho para salvar o arquivo
    """
    url = "http://localhost:3000/api/v1/download"
    params = {"url": youtube_url}
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        with open(output_path, "wb") as f:
            f.write(response.content)
        
        print(f"✅ Download concluído: {output_path}")
        
    except requests.exceptions.HTTPError as e:
        error_data = response.json()
        print(f"❌ Erro {error_data['status']}: {error_data['message']}")
    except Exception as e:
        print(f"❌ Erro: {str(e)}")

# Uso
download_audio("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
```

---

## 🧪 Testes

O projeto possui **100% de cobertura de testes** com 67 testes automatizados.

### Executar Testes

```bash
# Executar todos os testes
npm test

# Executar em modo watch
npm run test:watch

# Executar com cobertura
npm run test:coverage
```

### Estrutura de Testes

```text
tests/
├── unit/                          # Testes unitários
│   ├── controllers/
│   │   └── download.controller.test.ts
│   ├── services/
│   │   ├── download.service.test.ts
│   │   └── download.service.integration.test.ts
│   └── utils/
│       ├── apiResponse.test.ts
│       └── envConfig.test.ts
├── integration/                   # Testes de integração
│   ├── routes/
│   │   └── download.route.test.ts
│   └── server.test.ts
├── e2e/                          # Testes end-to-end
│   └── download.e2e.test.ts
└── setup.ts                      # Configuração global
```

### Cobertura Atual

```text
-------------------------|---------|----------|---------|---------|
File                     | % Stmts | % Branch | % Funcs | % Lines |
-------------------------|---------|----------|---------|---------|
All files                |     100 |      100 |     100 |     100 |
 controllers             |     100 |      100 |     100 |     100 |
 routes                  |     100 |      100 |     100 |     100 |
 services                |     100 |      100 |     100 |     100 |
 utils                   |     100 |      100 |     100 |     100 |
-------------------------|---------|----------|---------|---------|
```

---

## � Estrutura do Projeto

```text
youtube-music-download-api/
├── src/
│   ├── server.ts                           # Arquivo principal da aplicação
│   ├── controllers/
│   │   └── download.controller.ts          # Controlador de download
│   ├── routes/
│   │   └── download.route.ts               # Rotas da API
│   ├── services/
│   │   ├── download.service.ts             # Lógica de negócio
│   │   └── temp-download.ts                # Gerenciamento de temp
│   ├── types/
│   │   └── apiResponse.ts                  # Tipos TypeScript
│   └── utils/
│       ├── api/
│       │   └── apiResponse.ts              # Utilitário de resposta
│       ├── config/
│       │   └── envConfig.ts                # Configurações de ambiente
│       └── downloads/
├── tests/                                   # Testes automatizados
│   ├── unit/                               # Testes unitários
│   ├── integration/                        # Testes de integração
│   ├── e2e/                                # Testes end-to-end
│   └── setup.ts                            # Configuração de testes
├── dist/                                    # Código compilado (gerado)
├── coverage/                                # Relatórios de cobertura
├── docs/                                    # Documentação adicional
├── .env                                     # Variáveis de ambiente (não versionado)
├── .env.example                             # Exemplo de variáveis
├── .prettierrc                              # Configuração Prettier
├── jest.config.js                           # Configuração Jest
├── tsconfig.json                            # Configuração TypeScript
├── CHANGELOG.md                             # Histórico de mudanças
└── package.json                             # Dependências e scripts
```

---

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas clara e bem definida:

### Camadas

```text
┌─────────────────────────────────────────┐
│           Controllers                    │  ← Camada de Apresentação
│  (Validação de entrada e formatação)     │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│            Services                      │  ← Camada de Negócio
│  (Lógica de negócio e processamento)    │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│          External APIs                   │  ← Camada de Dados
│  (youtube-dl-exec, FFmpeg, File System) │
└─────────────────────────────────────────┘
```

### Padrões Utilizados

- **Singleton Pattern** - `DownloadService` e `EnvConfig`
- **Repository Pattern** - Acesso a dados externos
- **Dependency Injection** - Injeção de dependências
- **Error Handling** - Tratamento centralizado de erros
- **Response Standardization** - Respostas padronizadas com `ApiResponse`

---

## 🔒 Segurança

### Medidas Implementadas

- ✅ **Validação de Entrada** - Todas as URLs são validadas
- ✅ **Sanitização** - Nomes de arquivo são sanitizados
- ✅ **Limpeza Automática** - Arquivos temporários são removidos
- ✅ **Validação de Variáveis de Ambiente** - Verifica variáveis obrigatórias
- ✅ **Tratamento de Erros** - Erros não expõem detalhes internos
- ✅ **TypeScript** - Tipagem estática previne erros

### Boas Práticas

```typescript
// ✅ Validação de URL
if (!url || typeof url !== 'string') {
  return ApiResponse.error(res, 400, 'URL do YouTube é obrigatória');
}

// ✅ Sanitização de nome de arquivo
const sanitized = filename.replace(/[<>:"/\\|?*]/g, '').trim();

// ✅ Limpeza de recursos
finally {
  await this.cleanupTempDir(tempDir);
}
```

---

## 📊 Performance

### Otimizações

- **Streaming** - Download e conversão em streaming
- **Limpeza Assíncrona** - Remoção de arquivos não bloqueia
- **Gestão de Memória** - Buffers otimizados
- **Cache de Singleton** - Instâncias reutilizadas

### Métricas

| Operação | Tempo Médio | Memória |
|----------|-------------|---------|
| Download 3min MP3 | ~15-30s | ~50MB |
| Conversão FFmpeg | ~5-10s | ~30MB |
| Limpeza Temp | ~100ms | ~1MB |

---

## 🚧 Roadmap

### Próximas Versões

#### v1.4.0 (Planejado)

- [ ] Suporte a playlists do YouTube
- [ ] Múltiplos formatos de áudio (WAV, FLAC, AAC)
- [ ] Sistema de fila para downloads
- [ ] WebSockets para progresso em tempo real

#### v1.5.0 (Planejado)

- [ ] Autenticação JWT
- [ ] Rate limiting por IP
- [ ] Cache de downloads recentes
- [ ] Compressão de respostas (gzip)

#### v2.0.0 (Futuro)

- [ ] GraphQL API
- [ ] CI/CD com GitHub Actions
- [ ] Documentação OpenAPI/Swagger
- [ ] Métricas e monitoramento (Prometheus)

---

## 📖 Changelog

Veja o arquivo [CHANGELOG.md](CHANGELOG.md) para detalhes sobre as mudanças em cada versão.

**Versão Atual:** 1.3.0 (11 de outubro de 2025)

### 🆕 Novidades v1.3.0

- 📝 **Sistema de Logging Profissional com Pino**:
  - Logger estruturado de alta performance (~10x mais rápido que Winston)
  - Logs em formato JSON para produção
  - Logs formatados e coloridos para desenvolvimento (pino-pretty)
  - Níveis de log configuráveis (TRACE, DEBUG, INFO, WARN, ERROR, FATAL)
  - Middleware HTTP automático para logging de requisições
  - Child loggers com contexto específico por módulo
  - Otimizado para Raspberry Pi 4 e ambientes com recursos limitados
  - Serialização automática de erros com stack traces
- 📚 **Documentação Completa de Logging**:
  - Overview técnico detalhado
  - Guia rápido (Quickstart)
  - Exemplos práticos de uso
  - Boas práticas e integração
- ⚙️ **Nova Variável de Ambiente**: `LOG_LEVEL` para configurar nível de log

### Destaques v1.2.0

- 🐳 **Suporte Docker Completo**: Dockerfile multi-stage otimizado
  - Build em duas etapas para imagem final menor
  - Imagem baseada em Alpine Linux (~200MB)
  - Usuário não-root para segurança
  - Health checks integrados
- 🔧 **Docker Compose**: Orquestração simplificada
  - Configuração pronta para produção
  - Integração com rede externa (proxy_net)
  - Suporte a variáveis de ambiente
  - Security options otimizadas
- 📦 **Scripts Docker**: Novos comandos npm para gerenciamento
- 📝 **Documentação Docker**: Guia completo de uso do Docker
- 🔒 **Segurança Aprimorada**: Capabilities mínimas e boas práticas

### Destaques v1.1.0

- ✨ **Headers HTTP Customizados**: Acesso a metadados do áudio via headers
  - `X-Track-Title`: Título original do vídeo
  - `X-Track-Duration`: Duração em segundos
- 🔧 **CORS Configurável**: Headers expostos para acesso cross-origin
- 📚 **Documentação CORS**: Guia completo em `docs/CORS_HEADERS.md`
- 🧪 **68 Testes**: Mantida 100% de cobertura

### Destaques v1.0.0

- ✨ Primeira versão estável
- ✨ 100% de cobertura de testes
- ✨ API REST completa e documentada
- ✨ Arquitetura em camadas
- ✨ TypeScript com tipagem completa

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga os passos abaixo:

### 1️⃣ Fork o Projeto

```bash
git clone https://github.com/SEU-USUARIO/youtube-music-download-api.git
```

### 2️⃣ Crie uma Branch

```bash
git checkout -b feature/nova-funcionalidade
```

### 3️⃣ Commit suas Mudanças

```bash
git commit -m "feat: adiciona nova funcionalidade"
```

**Padrão de Commits:**

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação
- `refactor:` - Refatoração
- `test:` - Testes
- `chore:` - Manutenção

### 4️⃣ Push para o GitHub

```bash
git push origin feature/nova-funcionalidade
```

### 5️⃣ Abra um Pull Request

Descreva suas mudanças e aguarde a revisão!

---

## 📄 Licença

Este projeto está licenciado sob a **Licença MIT**.

Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

```text
MIT License

Copyright (c) 2025 Gabriel H. Finotti

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 👤 Autor

**Gabriel H. Finotti**

- GitHub: [@GabrielFinotti](https://github.com/GabrielFinotti)
- Email: [gabriel.finotti@example.com](mailto:gabriel.finotti@example.com)

---

## 🙏 Agradecimentos

- [youtube-dl-exec](https://github.com/microlinkhq/youtube-dl-exec) - Download de vídeos
- [FFmpeg](https://ffmpeg.org/) - Processamento de áudio
- [Express.js](https://expressjs.com/) - Framework web
- [TypeScript](https://www.typescriptlang.org/) - Superset JavaScript
- [Jest](https://jestjs.io/) - Framework de testes

---

## 📞 Suporte

Se encontrar problemas ou tiver dúvidas:

1. Consulte a [Documentação](#-api)
2. Verifique o [Changelog](CHANGELOG.md)
3. Veja os [Exemplos de Uso](#-exemplos-de-uso)
4. Abra uma [Issue](https://github.com/GabrielFinotti/youtube-music-download-api/issues)

---

<div align="center">

**[⬆ Voltar ao Topo](#-ytune-api)**

Feito com ❤️ por [Gabriel H. Finotti](https://github.com/GabrielFinotti)

**⭐ Deixe uma estrela se este projeto te ajudou!**

</div>
