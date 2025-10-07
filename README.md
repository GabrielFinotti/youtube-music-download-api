# youtube-music-download-api

API para download de músicas do YouTube

## 📋 Descrição

API REST desenvolvida em Node.js com TypeScript para download de músicas do YouTube e conversão para formato MP3.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset JavaScript com tipagem estática
- **Express** - Framework web
- **ytdl-core** - Download de vídeos do YouTube
- **fluent-ffmpeg** - Processamento de áudio para MP3
- **Jest** - Framework de testes
- **Prettier** - Formatação de código
- **dotenv** - Gerenciamento de variáveis de ambiente

## 📦 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- FFmpeg instalado no sistema

### Instalação do FFmpeg

**Ubuntu/Debian:**
```bash
sudo apt-get install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

**Windows:**
Baixe de [ffmpeg.org](https://ffmpeg.org/download.html) e adicione ao PATH

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/GabrielFinotti/youtube-music-download-api.git
cd youtube-music-download-api
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` conforme necessário.

## 🎯 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia o servidor em modo desenvolvimento com hot-reload

# Build
npm run build        # Compila o TypeScript para JavaScript

# Produção
npm start           # Inicia o servidor em produção

# Testes
npm test            # Executa os testes
npm run test:watch  # Executa os testes em modo watch
npm run test:coverage # Executa os testes com cobertura

# Formatação
npm run format       # Formata o código com Prettier
npm run format:check # Verifica a formatação do código
```

## 🔌 Endpoints

### GET /
Retorna informações sobre a API

**Resposta:**
```json
{
  "message": "YouTube Music Download API",
  "version": "1.0.0",
  "status": "running"
}
```

### GET /health
Verifica o status da API

**Resposta:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-XX..."
}
```

## 📝 Estrutura do Projeto

```
youtube-music-download-api/
├── src/
│   ├── index.ts          # Arquivo principal da aplicação
│   └── index.test.ts     # Testes da aplicação
├── dist/                 # Código compilado (gerado)
├── coverage/            # Relatórios de cobertura (gerado)
├── .env                 # Variáveis de ambiente (não versionado)
├── .env.example         # Exemplo de variáveis de ambiente
├── .prettierrc          # Configuração do Prettier
├── jest.config.js       # Configuração do Jest
├── tsconfig.json        # Configuração do TypeScript
└── package.json         # Dependências e scripts
```

## 🧪 Executando Testes

```bash
npm test
```

Para executar com cobertura:
```bash
npm run test:coverage
```

## 🎨 Formatação de Código

O projeto usa Prettier para manter a consistência do código:

```bash
npm run format
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

Gabriel H. Finotti

