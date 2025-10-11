# Sistema de Logging - YTune API

Este documento descreve o sistema de logging implementado na YTune API usando **Pino**, otimizado para Raspberry Pi 4.

## 🎯 Por que Pino?

Pino foi escolhido por ser:

- **Ultra rápido**: até 5x mais rápido que Winston
- **Baixíssimo overhead**: ideal para Raspberry Pi 4
- **Eficiente**: consome poucos recursos de CPU e memória
- **Estruturado**: logs em JSON nativamente

## 📋 Níveis de Log

Pino suporta os seguintes níveis (do mais ao menos crítico):

| Nível   | Valor | Uso                                        |
|---------|-------|--------------------------------------------|
| `fatal` | 60    | Erros fatais que causam crash da aplicação |
| `error` | 50    | Erros que precisam de atenção              |
| `warn`  | 40    | Avisos e situações suspeitas               |
| `info`  | 30    | Informações gerais (padrão em produção)    |
| `debug` | 20    | Informações de debug (padrão em dev)       |
| `trace` | 10    | Informações muito detalhadas               |

## ⚙️ Configuração

### Variável de Ambiente

Você pode configurar o nível de log via variável de ambiente `LOG_LEVEL`:

```bash
# No arquivo .env
LOG_LEVEL=info
```

**Comportamento padrão** (se não definido):

- **Development**: `debug` (mais verboso)
- **Production**: `info` (apenas informações essenciais)

### Níveis Recomendados por Ambiente

```bash
# Desenvolvimento local
LOG_LEVEL=debug

# Staging/Homologação
LOG_LEVEL=info

# Produção
LOG_LEVEL=info

# Debug de problemas específicos
LOG_LEVEL=trace
```

## 📊 Formato dos Logs

### Em Desenvolvimento

Logs são formatados de forma legível com cores usando `pino-pretty`:

```
[11:30:45] INFO [DownloadService]: Iniciando processo de download
    url: "https://youtube.com/watch?v=..."
[11:30:46] INFO [DownloadService]: Download concluído com sucesso
    title: "Nome da Música"
    size: 3456789
```

### Em Produção

Logs são em formato JSON para eficiência e parsing:

```json
{
  "level": 30,
  "time": 1696935045000,
  "env": "production",
  "version": "v1",
  "context": "DownloadService",
  "url": "https://youtube.com/watch?v=...",
  "msg": "Iniciando processo de download"
}
```

## 🔧 Uso no Código

### Logger Principal

```typescript
import Logger from './utils/logger/logger';

const logger = Logger.getInstance();

logger.info('Mensagem simples');
logger.info({ data: 'value' }, 'Mensagem com dados estruturados');
logger.error({ err: error }, 'Erro ao processar');
```

### Child Logger (Recomendado)

Para separar logs por contexto/módulo:

```typescript
import Logger from './utils/logger/logger';

class MeuService {
  private logger = Logger.createChildLogger('MeuService');

  myMethod() {
    this.logger.info('Executando método');
    this.logger.warn({ value: 123 }, 'Valor suspeito detectado');
  }
}
```

### Logs HTTP Automáticos

O middleware `pino-http` registra automaticamente todas as requisições:

```json
{
  "level": 30,
  "req": {
    "method": "GET",
    "url": "/api/v1/download",
    "query": { "url": "..." }
  },
  "res": {
    "statusCode": 200
  },
  "responseTime": 1234,
  "msg": "request completed"
}
```

## 📦 Otimizações para Raspberry Pi

As seguintes otimizações foram aplicadas:

1. **Serialização mínima**: apenas dados essenciais são logados
2. **Child loggers**: evita criação de múltiplas instâncias
3. **Timestamps ISO**: mais eficiente que formatos customizados
4. **JSON direto em produção**: sem overhead de formatação
5. **AutoLogging condicional**: desabilita duplicação em dev

## 🐛 Debug de Problemas

Para debug intensivo, você pode:

1. **Aumentar o nível de log temporariamente**:

   ```bash
   LOG_LEVEL=trace npm run dev
   ```

2. **Analisar logs estruturados**:

   ```bash
   # Filtrar apenas erros
   cat logs.json | grep '"level":50'
   
   # Filtrar por contexto
   cat logs.json | grep '"context":"DownloadService"'
   ```

3. **Usar pino-pretty para ler logs JSON**:

   ```bash
   cat logs.json | npx pino-pretty
   ```

## 📈 Monitoramento

Os logs estruturados facilitam integração com ferramentas de monitoramento:

- **Loki**: para agregação de logs
- **Grafana**: para visualização
- **ELK Stack**: para análise avançada
- **CloudWatch**: se hospedar na AWS

## 💡 Boas Práticas

1. **Use child loggers** para contexto específico
2. **Evite logs em loops intensivos** (use sample/throttle)
3. **Sempre inclua contexto relevante** nos logs
4. **Use níveis apropriados**:
   - `error`: para erros que precisam atenção
   - `warn`: para situações suspeitas
   - `info`: para fluxo normal da aplicação
   - `debug`: para informações detalhadas
5. **Não logue dados sensíveis** (senhas, tokens, etc.)

## 📝 Exemplo Completo

```typescript
import Logger from './utils/logger/logger';

class VideoProcessor {
  private logger = Logger.createChildLogger('VideoProcessor');

  async processVideo(url: string) {
    this.logger.info({ url }, 'Iniciando processamento');

    try {
      // Processamento
      const result = await this.download(url);
      
      this.logger.info(
        { 
          title: result.title, 
          size: result.size,
          duration: result.duration 
        },
        'Vídeo processado com sucesso'
      );

      return result;
    } catch (error) {
      this.logger.error(
        { err: error, url },
        'Falha ao processar vídeo'
      );
      throw error;
    }
  }
}
```

## 🔗 Recursos

- [Documentação Pino](https://getpino.io)
- [Pino Best Practices](https://github.com/pinojs/pino/blob/master/docs/best-practices.md)
- [Pino API](https://github.com/pinojs/pino/blob/master/docs/api.md)
