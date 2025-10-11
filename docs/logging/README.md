# 📝 Sistema de Logging

Documentação completa do sistema de logging Pino otimizado para Raspberry Pi 4.

## 📄 Documentos Disponíveis

### [📘 Overview - Visão Geral](./overview.md)

Documentação técnica completa do sistema de logging:

- Por que Pino?
- Níveis de log disponíveis
- Configuração e variáveis de ambiente
- Formato dos logs (dev vs prod)
- Uso no código
- Otimizações para Raspberry Pi
- Boas práticas
- Integração com ferramentas de monitoramento

### [🚀 Quickstart - Guia Rápido](./quickstart.md)

Comece a usar o sistema de logging rapidamente:

- Como usar em desenvolvimento
- Como usar em produção/Docker
- Configurar níveis de log
- Principais benefícios
- Arquivos modificados
- Customização básica

### [💡 Examples - Exemplos Práticos](./examples.md)

Exemplos reais de saída de logs:

- Logs em ambiente de desenvolvimento
- Logs em ambiente de produção (JSON)
- Requisições bem-sucedidas
- Tratamento de erros
- Logs HTTP automáticos
- Análise de performance
- Casos de uso práticos

---

## 🎯 Por Onde Começar?

1. **Novo no projeto?** → Comece pelo [Quickstart](./quickstart.md)
2. **Quer entender em detalhes?** → Leia o [Overview](./overview.md)
3. **Precisa ver exemplos?** → Veja [Examples](./examples.md)

---

## 🔧 Configuração Rápida

```bash
# Variável de ambiente (opcional)
LOG_LEVEL=info  # ou debug, trace, warn, error
```

## 📊 Formato Padrão

```
[10/10/2025 21:51:26] INFO: [Server] Servidor rodando na porta 3000
[10/10/2025 21:51:30] INFO: [DownloadService] Download concluído com sucesso
```

---

**Voltar para**: [📚 Documentação Principal](../README.md)
