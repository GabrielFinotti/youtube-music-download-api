import { Request, Response } from 'express';
import DownloadController from '../../../src/controllers/download.controller';
import DownloadService from '../../../src/services/download.service';

// Mock do DownloadService
jest.mock('../../../src/services/download.service');

describe('DownloadController', () => {
  let controller: DownloadController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockDownloadService: jest.Mocked<DownloadService>;

  beforeEach(() => {
    // Reset dos mocks
    jest.clearAllMocks();

    // Configurar o mock do DownloadService
    mockDownloadService = {
      download: jest.fn(),
    } as any;

    (DownloadService.getInstance as jest.Mock).mockReturnValue(
      mockDownloadService
    );

    // Criar instância do controller
    controller = new DownloadController();

    // Configurar mock do Response
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
    };

    // Configurar mock do Request
    mockRequest = {
      query: {},
    };
  });

  describe('download', () => {
    it('deve retornar erro 400 quando URL não for fornecida', async () => {
      mockRequest.query = {};

      await controller.download(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        status: 400,
        error: 'URL é obrigatória',
        details: 'Forneça uma URL válida do YouTube como query parameter',
      });
    });

    it('deve retornar erro 400 quando URL não for uma string', async () => {
      mockRequest.query = { url: ['array', 'of', 'strings'] };

      await controller.download(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        status: 400,
        error: 'URL é obrigatória',
        details: 'Forneça uma URL válida do YouTube como query parameter',
      });
    });

    it('deve processar download com sucesso e retornar buffer de áudio', async () => {
      const mockUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      const mockBuffer = Buffer.from('fake audio data');
      const mockResult = {
        title: 'Test Video',
        filename: 'Test Video.mp3',
        duration: 180,
        size: 1024000,
        buffer: mockBuffer,
      };

      mockRequest.query = { url: mockUrl };
      mockDownloadService.download.mockResolvedValue(mockResult);

      await controller.download(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockDownloadService.download).toHaveBeenCalledWith(mockUrl);
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'audio/mpeg'
      );
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        `attachment; filename="${encodeURIComponent(mockResult.filename)}"`
      );
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Length',
        mockResult.size
      );
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'X-Track-Title',
        encodeURIComponent(mockResult.title)
      );
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'X-Track-Duration',
        mockResult.duration.toString()
      );
      expect(mockResponse.send).toHaveBeenCalledWith(mockBuffer);
    });

    it('deve retornar erro 500 quando o serviço lançar uma exceção', async () => {
      const mockUrl = 'https://www.youtube.com/watch?v=invalid';
      const errorMessage = 'Erro ao baixar áudio: Video not found';

      mockRequest.query = { url: mockUrl };
      mockDownloadService.download.mockRejectedValue(new Error(errorMessage));

      await controller.download(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        status: 500,
        error: 'Erro ao processar download',
        details: errorMessage,
      });
    });

    it('deve tratar erros desconhecidos (não-Error)', async () => {
      const mockUrl = 'https://www.youtube.com/watch?v=test';

      mockRequest.query = { url: mockUrl };
      mockDownloadService.download.mockRejectedValue('string error');

      await controller.download(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        status: 500,
        error: 'Erro ao processar download',
        details: 'Erro desconhecido',
      });
    });

    it('deve codificar corretamente caracteres especiais nos headers', async () => {
      const mockUrl = 'https://www.youtube.com/watch?v=test';
      const mockResult = {
        title: 'Música Título Especial & Test',
        filename: 'Música Título Especial & Test.mp3',
        duration: 180,
        size: 1024000,
        buffer: Buffer.from('audio'),
      };

      mockRequest.query = { url: mockUrl };
      mockDownloadService.download.mockResolvedValue(mockResult);

      await controller.download(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'X-Track-Title',
        encodeURIComponent(mockResult.title)
      );
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        `attachment; filename="${encodeURIComponent(mockResult.filename)}"`
      );
    });
  });
});
