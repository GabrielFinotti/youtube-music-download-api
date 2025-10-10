import express, { Request, Response } from 'express';
import EnvConfig from './utils/config/envConfig';
import downloadRoute from './routes/download.route';

const app = express();
const envInstance = EnvConfig.getInstance();

app.use(express.json());

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
    console.log(`Iniciando servidor no ambiente ${envInstance.NODE_ENV}...`);

    app.listen(envInstance.PORT, () => {
      console.log(`Servidor rodando na porta ${envInstance.PORT}`);
      console.log(`Versão da API: ${envInstance.VERSION}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
};

startServer();
