import DownloadService from '../../../src/services/download.service';
import youtubedl from 'youtube-dl-exec';
import fs from 'fs/promises';
import path from 'path';

// Mock do youtube-dl-exec
jest.mock('youtube-dl-exec');
jest.mock('fs/promises');

describe('DownloadService - Integration with Mocks', () => {
  let downloadService: DownloadService;

  beforeEach(() => {
    downloadService = DownloadService.getInstance();
    jest.clearAllMocks();
  });

  describe('download - fluxo completo com mocks', () => {
    it('deve completar o fluxo de download com sucesso', async () => {
      const mockUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      const mockBuffer = Buffer.from('fake audio content');
      const mockVideoInfo = {
        title: 'Test Video Title',
        duration: 180,
      };

      // Mock do youtube-dl para obter informações
      (youtubedl as jest.MockedFunction<typeof youtubedl>)
        .mockResolvedValueOnce(mockVideoInfo as any);

      // Mock do youtube-dl para download
      (youtubedl as jest.MockedFunction<typeof youtubedl>)
        .mockResolvedValueOnce(undefined as any);

      // Mock das operações de filesystem
      (fs.readFile as jest.MockedFunction<typeof fs.readFile>)
        .mockResolvedValue(mockBuffer);
      
      (fs.stat as jest.MockedFunction<typeof fs.stat>)
        .mockResolvedValue({ size: mockBuffer.length } as any);

      (fs.mkdir as jest.MockedFunction<typeof fs.mkdir>)
        .mockResolvedValue(undefined as any);

      (fs.rm as jest.MockedFunction<typeof fs.rm>)
        .mockResolvedValue(undefined as any);

      const result = await downloadService.download(mockUrl);

      expect(result).toEqual({
        title: mockVideoInfo.title,
        filename: 'Test Video Title.mp3',
        duration: mockVideoInfo.duration,
        size: mockBuffer.length,
        buffer: mockBuffer,
      });

      // Verificar que youtube-dl foi chamado duas vezes
      expect(youtubedl).toHaveBeenCalledTimes(2);

      // Verificar primeira chamada (obter info)
      expect(youtubedl).toHaveBeenNthCalledWith(1, mockUrl, {
        dumpSingleJson: true,
        noWarnings: true,
        noCheckCertificates: true,
        preferFreeFormats: true,
      });

      // Verificar que cleanup foi chamado
      expect(fs.rm).toHaveBeenCalled();
    });

    it('deve processar URL com playlist corretamente', async () => {
      const mockUrl =
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLtest123';
      const mockBuffer = Buffer.from('fake audio');
      const mockVideoInfo = {
        title: 'Playlist Video',
        duration: 120,
      };

      (youtubedl as jest.MockedFunction<typeof youtubedl>)
        .mockResolvedValueOnce(mockVideoInfo as any)
        .mockResolvedValueOnce(undefined as any);

      (fs.readFile as jest.MockedFunction<typeof fs.readFile>)
        .mockResolvedValue(mockBuffer);
      
      (fs.stat as jest.MockedFunction<typeof fs.stat>)
        .mockResolvedValue({ size: mockBuffer.length } as any);

      (fs.mkdir as jest.MockedFunction<typeof fs.mkdir>)
        .mockResolvedValue(undefined as any);

      (fs.rm as jest.MockedFunction<typeof fs.rm>)
        .mockResolvedValue(undefined as any);

      const result = await downloadService.download(mockUrl);

      expect(result.title).toBe(mockVideoInfo.title);

      // Verificar que a URL foi limpa (sem playlist)
      const cleanUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      expect(youtubedl).toHaveBeenNthCalledWith(1, cleanUrl, expect.any(Object));
    });

    it('deve limpar diretório temporário em caso de erro', async () => {
      const mockUrl = 'https://www.youtube.com/watch?v=errorvideo';

      (fs.mkdir as jest.MockedFunction<typeof fs.mkdir>)
        .mockResolvedValue(undefined as any);

      (youtubedl as jest.MockedFunction<typeof youtubedl>)
        .mockRejectedValue(new Error('Video não encontrado'));

      (fs.rm as jest.MockedFunction<typeof fs.rm>)
        .mockResolvedValue(undefined as any);

      await expect(downloadService.download(mockUrl)).rejects.toThrow(
        'Erro ao baixar áudio: Video não encontrado'
      );

      // Verificar que cleanup foi chamado mesmo com erro
      expect(fs.rm).toHaveBeenCalled();
    });

    it('deve tratar erro não-Error corretamente', async () => {
      const mockUrl = 'https://www.youtube.com/watch?v=test';

      (fs.mkdir as jest.MockedFunction<typeof fs.mkdir>)
        .mockResolvedValue(undefined as any);

      // Lançar um erro que não é instância de Error
      (youtubedl as jest.MockedFunction<typeof youtubedl>)
        .mockRejectedValue('String error');

      (fs.rm as jest.MockedFunction<typeof fs.rm>)
        .mockResolvedValue(undefined as any);

      await expect(downloadService.download(mockUrl)).rejects.toThrow(
        'Erro desconhecido ao baixar áudio'
      );
    });

    it('deve sanitizar nomes de arquivo no resultado', async () => {
      const mockUrl = 'https://www.youtube.com/watch?v=test';
      const mockBuffer = Buffer.from('audio');
      const mockVideoInfo = {
        title: 'Video: Test <> Title | Special?',
        duration: 100,
      };

      (youtubedl as jest.MockedFunction<typeof youtubedl>)
        .mockResolvedValueOnce(mockVideoInfo as any)
        .mockResolvedValueOnce(undefined as any);

      (fs.readFile as jest.MockedFunction<typeof fs.readFile>)
        .mockResolvedValue(mockBuffer);
      
      (fs.stat as jest.MockedFunction<typeof fs.stat>)
        .mockResolvedValue({ size: mockBuffer.length } as any);

      (fs.mkdir as jest.MockedFunction<typeof fs.mkdir>)
        .mockResolvedValue(undefined as any);

      (fs.rm as jest.MockedFunction<typeof fs.rm>)
        .mockResolvedValue(undefined as any);

      const result = await downloadService.download(mockUrl);

      // Verificar que caracteres especiais foram sanitizados
      expect(result.filename).not.toContain('<');
      expect(result.filename).not.toContain('>');
      expect(result.filename).not.toContain('?');
      expect(result.filename).not.toContain('|');
      expect(result.filename).toContain('.mp3');
    });

    it('deve usar duration 0 quando não fornecido', async () => {
      const mockUrl = 'https://www.youtube.com/watch?v=test';
      const mockBuffer = Buffer.from('audio');
      const mockVideoInfo = {
        title: 'Test Video',
        // duration não fornecido
      };

      (youtubedl as jest.MockedFunction<typeof youtubedl>)
        .mockResolvedValueOnce(mockVideoInfo as any)
        .mockResolvedValueOnce(undefined as any);

      (fs.readFile as jest.MockedFunction<typeof fs.readFile>)
        .mockResolvedValue(mockBuffer);
      
      (fs.stat as jest.MockedFunction<typeof fs.stat>)
        .mockResolvedValue({ size: mockBuffer.length } as any);

      (fs.mkdir as jest.MockedFunction<typeof fs.mkdir>)
        .mockResolvedValue(undefined as any);

      (fs.rm as jest.MockedFunction<typeof fs.rm>)
        .mockResolvedValue(undefined as any);

      const result = await downloadService.download(mockUrl);

      expect(result.duration).toBe(0);
    });
  });
});
