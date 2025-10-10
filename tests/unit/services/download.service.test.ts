import DownloadService from '../../../src/services/download.service';

describe('DownloadService', () => {
  let downloadService: DownloadService;

  beforeEach(() => {
    downloadService = DownloadService.getInstance();
  });

  describe('getInstance', () => {
    it('deve retornar sempre a mesma instância (Singleton)', () => {
      const instance1 = DownloadService.getInstance();
      const instance2 = DownloadService.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('validateYouTubeUrl', () => {
    it('deve validar URLs válidas do YouTube', () => {
      const validUrls = [
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'http://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://youtube.com/watch?v=dQw4w9WgXcQ',
        'https://youtu.be/dQw4w9WgXcQ',
        'http://youtu.be/dQw4w9WgXcQ',
        'www.youtube.com/watch?v=dQw4w9WgXcQ',
      ];

      validUrls.forEach((url) => {
        // @ts-ignore - acessando método privado para teste
        expect(downloadService['validateYouTubeUrl'](url)).toBe(true);
      });
    });

    it('deve rejeitar URLs inválidas', () => {
      const invalidUrls = [
        'https://google.com',
        'https://vimeo.com/123456',
        'not-a-url',
        '',
        'ftp://youtube.com/watch?v=test',
      ];

      invalidUrls.forEach((url) => {
        // @ts-ignore - acessando método privado para teste
        expect(downloadService['validateYouTubeUrl'](url)).toBe(false);
      });
    });
  });

  describe('isPlaylist', () => {
    it('deve identificar URLs de playlist', () => {
      const playlistUrls = [
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf',
        'https://www.youtube.com/playlist?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf',
      ];

      playlistUrls.forEach((url) => {
        // @ts-ignore - acessando método privado para teste
        expect(downloadService['isPlaylist'](url)).toBe(true);
      });
    });

    it('deve identificar URLs que não são playlist', () => {
      const nonPlaylistUrls = [
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://youtu.be/dQw4w9WgXcQ',
      ];

      nonPlaylistUrls.forEach((url) => {
        // @ts-ignore - acessando método privado para teste
        expect(downloadService['isPlaylist'](url)).toBe(false);
      });
    });
  });

  describe('extractVideoUrl', () => {
    it('deve extrair URL limpa de uma URL com playlist', () => {
      const url =
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLtest&index=1';
      // @ts-ignore - acessando método privado para teste
      const result = downloadService['extractVideoUrl'](url);

      expect(result).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    });

    it('deve processar URLs do formato youtu.be', () => {
      const url = 'https://youtu.be/dQw4w9WgXcQ?list=PLtest';
      // @ts-ignore - acessando método privado para teste
      const result = downloadService['extractVideoUrl'](url);

      expect(result).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    });

    it('deve lançar erro para URL sem video ID', () => {
      const url = 'https://www.youtube.com/feed/trending';

      expect(() => {
        // @ts-ignore - acessando método privado para teste
        downloadService['extractVideoUrl'](url);
      }).toThrow('URL inválida do YouTube');
    });

    it('deve lançar erro para URL inválida', () => {
      const url = 'not-a-valid-url';

      expect(() => {
        // @ts-ignore - acessando método privado para teste
        downloadService['extractVideoUrl'](url);
      }).toThrow('URL inválida do YouTube');
    });
  });

  describe('sanitizeFilename', () => {
    it('deve remover caracteres inválidos do nome do arquivo', () => {
      const testCases = [
        { input: 'normal filename', expected: 'normal filename' },
        { input: 'file<name>', expected: 'file_name_' },
        { input: 'file:name', expected: 'file_name' },
        { input: 'file/name', expected: 'file_name' },
        { input: 'file\\name', expected: 'file_name' },
        { input: 'file|name', expected: 'file_name' },
        { input: 'file?name', expected: 'file_name' },
        { input: 'file*name', expected: 'file_name' },
        { input: 'file"name"', expected: 'file_name_' },
      ];

      testCases.forEach(({ input, expected }) => {
        // @ts-ignore - acessando método privado para teste
        const result = downloadService['sanitizeFilename'](input);
        expect(result).toBe(expected);
      });
    });

    it('deve remover espaços extras no início e fim', () => {
      // @ts-ignore - acessando método privado para teste
      const result = downloadService['sanitizeFilename']('  filename  ');
      expect(result).toBe('filename');
    });
  });

  describe('download', () => {
    it('deve lançar erro para URL inválida', async () => {
      await expect(downloadService.download('https://google.com')).rejects.toThrow(
        'URL do YouTube inválida'
      );
    });

    it('deve lançar erro para URL vazia', async () => {
      await expect(downloadService.download('')).rejects.toThrow(
        'URL do YouTube inválida'
      );
    });
  });

  describe('cleanupTempDir', () => {
    it('deve lidar com erros ao limpar diretório', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const fakeError = new Error('Permission denied');

      // Mockar fs.rm para lançar erro
      const fsRmMock = jest.spyOn(require('fs/promises'), 'rm')
        .mockRejectedValueOnce(fakeError);

      // Acessar método privado para teste
      // @ts-ignore
      await downloadService['cleanupTempDir']('/fake/path');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Erro ao limpar diretório temporário:',
        fakeError
      );

      consoleErrorSpy.mockRestore();
      fsRmMock.mockRestore();
    });
  });

  describe('createTempDir', () => {
    it('deve criar um diretório temporário único', async () => {
      const mkdirMock = jest.spyOn(require('fs/promises'), 'mkdir')
        .mockResolvedValueOnce(undefined);

      // @ts-ignore - acessando método privado para teste
      const tempDir = await downloadService['createTempDir']();

      expect(tempDir).toContain('ytune-downloads');
      expect(mkdirMock).toHaveBeenCalledWith(
        tempDir,
        { recursive: true }
      );

      mkdirMock.mockRestore();
    });
  });
});
