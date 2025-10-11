import express, { Request, Response } from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import EnvConfig from './utils/config/envConfig';
import downloadRoute from './routes/download.route';
import Logger from './utils/logger/logger';

const app = express();
const envInstance = EnvConfig.getInstance();
const logger = Logger.createChildLogger('Server');

app.use(
  pinoHttp({
    logger: Logger.getInstance(), 
    customLogLevel: (req, res, err) => {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return 'warn';
      } else if (res.statusCode >= 500 || err) {
        return 'error';
      }
      return 'info';
    },
    serializers: {
      req: req => ({
        method: req.method,
        url: req.url,
        query: req.query,
      }),
      res: res => ({
        statusCode: res.statusCode,
      }),
    },
    autoLogging: envInstance.NODE_ENV !== 'development',
  })
);

app.use(express.json());
app.use(
  cors({
    origin: envInstance.CORS,
    exposedHeaders: [
      'Content-Disposition',
      'X-Track-Title',
      'X-Track-Duration',
    ],
  })
);

app.get(`/api/${envInstance.VERSION}/health`, (_: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: envInstance.VERSION,
  });
});

app.use(`/api/${envInstance.VERSION}`, downloadRoute);

const startServer = async () => {
  try {
    logger.info(`Iniciando servidor no ambiente ${envInstance.NODE_ENV}...`);

    app.listen(envInstance.PORT, () => {
      logger.info(`Servidor rodando na porta ${envInstance.PORT}`);
      logger.info(`Versão da API: ${envInstance.VERSION}`);
    });
  } catch (error) {
    logger.error({ err: error }, 'Erro ao iniciar o servidor');
    process.exit(1);
  }
};

startServer();
