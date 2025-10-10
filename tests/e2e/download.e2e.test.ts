import request from 'supertest';
import express, { Express, Request, Response } from 'express';
import downloadRoute from '../../src/routes/download.route';
import DownloadService from '../../src/services/download.service';

/**
 * Testes End-to-End
 *
 * IMPORTANTE: Estes testes fazem chamadas reais à API do YouTube.
 * Eles devem ser executados com cautela e podem falhar devido a:
 * - Limitações de taxa da API do YouTube
 * - Problemas de rede
 * - Vídeos removidos ou indisponíveis
 *
 * Para executar apenas estes testes: npm test -- e2e
 * Para pular estes testes: npm test -- --testPathIgnorePatterns=e2e
 */
describe('E2E: Download Flow', () => {
  let app: Express;
  const VERSION = 'v1';

  // URL de teste - vídeo de domínio público curto
  const TEST_VIDEO_URL = 'https://www.youtube.com/watch?v=jNQXAC9IVRw'; // "Me at the zoo" - primeiro vídeo do YouTube
  const TIMEOUT = 60000; // 60 segundos para downloads reais

  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    process.env.PORT = '3000';
    process.env.CORS = '*';
    process.env.VERSION = VERSION;
    process.env.SECRET_KEY = 'test-secret-key';

    app = express();
    app.use(express.json());

    app.get(`/api/${VERSION}/health`, (_: Request, res: Response) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: VERSION,
      });
    });

    app.use(`/api/${VERSION}`, downloadRoute);
  });

  describe('Real Download Test', () => {
    // Este teste pode ser lento e depende de fatores externos
    it.skip(
      'deve baixar um vídeo real do YouTube',
      async () => {
        const response = await request(app)
          .get(`/api/${VERSION}/download`)
          .query({ url: TEST_VIDEO_URL })
          .timeout(TIMEOUT);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('audio/mpeg');
        expect(response.headers['content-disposition']).toContain('attachment');
        expect(response.headers['x-track-title']).toBeDefined();
        expect(response.headers['x-track-duration']).toBeDefined();
        expect(response.body).toBeInstanceOf(Buffer);
        expect(response.body.length).toBeGreaterThan(0);
      },
      TIMEOUT
    );

    it.skip(
      'deve processar URL com playlist e baixar apenas o vídeo',
      async () => {
        const urlWithPlaylist = `${TEST_VIDEO_URL}&list=PLtest123`;

        const response = await request(app)
          .get(`/api/${VERSION}/download`)
          .query({ url: urlWithPlaylist })
          .timeout(TIMEOUT);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('audio/mpeg');
      },
      TIMEOUT
    );
  });

  describe('Error Handling E2E', () => {
    it(
      'deve retornar erro para vídeo inexistente',
      async () => {
        const invalidUrl =
          'https://www.youtube.com/watch?v=invalidVideoId123456';

        const response = await request(app)
          .get(`/api/${VERSION}/download`)
          .query({ url: invalidUrl })
          .timeout(TIMEOUT);

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Erro ao processar download');
      },
      TIMEOUT
    );

    it('deve retornar erro para URL de site diferente do YouTube', async () => {
      const nonYoutubeUrl = 'https://www.vimeo.com/123456';

      const response = await request(app)
        .get(`/api/${VERSION}/download`)
        .query({ url: nonYoutubeUrl });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.details).toContain('URL do YouTube inválida');
    });
  });

  describe('Service Layer E2E', () => {
    let downloadService: DownloadService;

    beforeAll(() => {
      downloadService = DownloadService.getInstance();
    });

    it('deve validar URLs do YouTube corretamente', () => {
      const validUrls = [
        'https://www.youtube.com/watch?v=test',
        'https://youtu.be/test',
        'http://youtube.com/watch?v=test',
      ];

      validUrls.forEach(url => {
        // @ts-ignore
        expect(downloadService['validateYouTubeUrl'](url)).toBe(true);
      });
    });

    it('deve sanitizar nomes de arquivo corretamente', () => {
      const dangerousFilename = 'test<>:"/\\|?*file.mp3';
      // @ts-ignore
      const sanitized = downloadService['sanitizeFilename'](dangerousFilename);

      expect(sanitized).not.toContain('<');
      expect(sanitized).not.toContain('>');
      expect(sanitized).not.toContain(':');
      expect(sanitized).not.toContain('"');
      expect(sanitized).not.toContain('/');
      expect(sanitized).not.toContain('\\');
      expect(sanitized).not.toContain('|');
      expect(sanitized).not.toContain('?');
      expect(sanitized).not.toContain('*');
    });
  });

  describe('Complete Flow E2E', () => {
    it('deve processar todo o fluxo de health check e validação', async () => {
      // 1. Verificar health
      const healthResponse = await request(app).get(`/api/${VERSION}/health`);
      expect(healthResponse.status).toBe(200);
      expect(healthResponse.body.status).toBe('ok');

      // 2. Tentar download sem URL (deve falhar)
      const noUrlResponse = await request(app).get(`/api/${VERSION}/download`);
      expect(noUrlResponse.status).toBe(400);

      // 3. Tentar download com URL inválida (deve falhar)
      const invalidUrlResponse = await request(app)
        .get(`/api/${VERSION}/download`)
        .query({ url: 'https://google.com' });
      expect(invalidUrlResponse.status).toBe(500);
    });
  });
});
