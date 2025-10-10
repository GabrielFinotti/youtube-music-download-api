import request from 'supertest';
import express, { Express } from 'express';
import downloadRoute from '../../../src/routes/download.route';

describe('Download Routes', () => {
  let app: Express;

  beforeEach(() => {
    // Configurar app Express para testes
    app = express();
    app.use(express.json());
    app.use('/api/v1', downloadRoute);
  });

  describe('GET /api/v1/download', () => {
    it('deve retornar 400 quando URL não for fornecida', async () => {
      const response = await request(app).get('/api/v1/download');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        status: 400,
        error: 'URL é obrigatória',
        details: 'Forneça uma URL válida do YouTube como query parameter',
      });
    });

    it('deve retornar 400 quando URL estiver vazia', async () => {
      const response = await request(app).get('/api/v1/download?url=');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        status: 400,
        error: 'URL é obrigatória',
        details: 'Forneça uma URL válida do YouTube como query parameter',
      });
    });

    it('deve retornar 500 para URL inválida (não-YouTube)', async () => {
      const mockUrl = 'https://www.google.com';

      const response = await request(app).get(
        `/api/v1/download?url=${encodeURIComponent(mockUrl)}`
      );

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Erro ao processar download');
      expect(response.body.details).toContain('URL do YouTube inválida');
    });

    it('deve ter a rota configurada corretamente', async () => {
      // Apenas verificar se a rota existe e está configurada
      const response = await request(app).get('/api/v1/download');

      // A rota existe (não é 404) e retorna erro de validação (400)
      expect(response.status).not.toBe(404);
      expect(response.status).toBe(400);
    });
  });
});
