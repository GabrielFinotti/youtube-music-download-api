# 📝 Guia Rápido - Sistema de Logging

## ✅ Implementado com Sucesso

O sistema de logging Pino foi configurado e está **otimizado para Raspberry Pi 4**.

## 🚀 Como Usar

### 1. Desenvolvimento Local

```bash
npm run dev
```

Você verá logs coloridos e formatados no terminal:

```
[11:30:45] INFO [Server]: Iniciando servidor no ambiente development...
[11:30:45] INFO [Server]: Servidor rodando na porta 3000
[11:30:46] INFO [DownloadController]: Nova requisição de download recebida
[11:30:47] INFO [DownloadService]: Iniciando processo de download
```

### 2. Produção (Docker)

No Docker Compose, os logs serão em JSON para melhor performance:

```bash
docker compose up -d
docker compose logs -f
```

Logs em JSON:

```json
{"level":30,"time":1696935045000,"env":"production","context":"Server","msg":"Servidor rodando na porta 3000"}
```

### 3. Configurar Nível de Log

No arquivo `.env`:

```bash
# Para mais detalhes (desenvolvimento)
LOG_LEVEL=debug

# Para produção (recomendado)
LOG_LEVEL=info

# Para troubleshooting intensivo
LOG_LEVEL=trace
```

## 🎯 Principais Benefícios

### ✨ Performance

- **5x mais rápido** que Winston
- **Baixíssimo uso de CPU/memória** no Raspberry Pi
- Ideal para ambientes com recursos limitados

### 🔍 Rastreabilidade

- Todos os logs têm contexto (Controller, Service, etc.)
- Dados estruturados facilitam debug
- Timestamps precisos

### 📊 Produção Ready

- JSON para fácil parsing
- Integração com Grafana/Loki
- Níveis de log configuráveis

## 📁 Arquivos Modificados

```
✅ src/utils/logger/logger.ts       # Configuração centralizada
✅ src/server.ts                     # Middleware HTTP + logs
✅ src/services/download.service.ts  # Logs do serviço
✅ src/controllers/download.controller.ts  # Logs do controller
✅ src/utils/config/envConfig.ts     # Suporte a LOG_LEVEL
✅ .env.example                       # Documentação
✅ docs/LOGGING.md                   # Documentação completa
```

## 🔧 Customização

### Criar novo logger em um serviço

```typescript
import Logger from './utils/logger/logger';

class MeuService {
  private logger = Logger.createChildLogger('MeuService');

  minhaFuncao() {
    this.logger.info('Executando função');
    this.logger.error({ err: error }, 'Erro ao executar');
  }
}
```

## 📖 Documentação Completa

Veja [overview.md](./overview.md) para:
- Níveis de log detalhados
- Melhores práticas
- Otimizações específicas do Raspberry Pi
- Exemplos avançados
- Integração com ferramentas de monitoramento

## 🎉 Pronto para Usar!

O sistema de logging está completamente funcional e otimizado. Apenas rode a aplicação e os logs aparecerão automaticamente!

---

**Documentação relacionada**:
- [Overview - Visão Geral](./overview.md)
- [Examples - Exemplos Práticos](./examples.md)
- [Voltar para Logging](./README.md)
- [Voltar para Documentação Principal](../README.md)
