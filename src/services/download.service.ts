import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import youtubedl from 'youtube-dl-exec';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';
import { randomUUID } from 'crypto';

interface DownloadResult {
  title: string;
  filename: string;
  duration: number;
  size: number;
  buffer: Buffer;
}

class DownloadService {
  private static instance: DownloadService;
  private _ffmpegPath = ffmpegInstaller.path;
  private _youtubeRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  private _isPlaylistRegex = /[?&]list=([^&]+)/;

  private constructor() {}

  static getInstance(): DownloadService {
    if (!DownloadService.instance) {
      DownloadService.instance = new DownloadService();
    }

    return DownloadService.instance;
  }

  private async createTempDir(): Promise<string> {
    const tempDir = path.join(os.tmpdir(), 'ytune-downloads', randomUUID());

    await fs.mkdir(tempDir, { recursive: true });

    return tempDir;
  }

  private async cleanupTempDir(dirPath: string): Promise<void> {
    try {
      console.info(
        `[Download Service] Limpando diretório temporário: ${dirPath}`
      );
      await fs.rm(dirPath, { recursive: true, force: true });
      console.info(
        '[Download Service] Diretório temporário removido com sucesso'
      );
    } catch (error) {
      console.error('Erro ao limpar diretório temporário:', error);
    }
  }

  private extractVideoUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get('v');

      if (!videoId) {
        const match = url.match(/youtu\.be\/([^?]+)/);

        if (match) {
          return `https://www.youtube.com/watch?v=${match[1]}`;
        }

        throw new Error('Não foi possível extrair o video ID da URL');
      }

      return `https://www.youtube.com/watch?v=${videoId}`;
    } catch (error) {
      throw new Error('URL inválida do YouTube');
    }
  }

  async download(url: string): Promise<DownloadResult> {
    let tempDir: string | null = null;

    try {
      console.info(
        `[Download Service] Iniciando processo de download para: ${url}`
      );

      if (!this.validateYouTubeUrl(url)) {
        console.info(
          '[Download Service] Validação falhou: URL do YouTube inválida'
        );
        throw new Error('URL do YouTube inválida');
      }

      console.info('[Download Service] URL validada com sucesso');

      const isPlaylistUrl = this.isPlaylist(url);
      const cleanUrl = isPlaylistUrl ? this.extractVideoUrl(url) : url;

      if (isPlaylistUrl) {
        console.info(
          `[Download Service] URL de playlist detectada, extraindo vídeo: ${cleanUrl}`
        );
      }

      tempDir = await this.createTempDir();
      console.info(
        `[Download Service] Diretório temporário criado: ${tempDir}`
      );

      const outputTemplate = path.join(tempDir, '%(title)s.%(ext)s');
      const options = {
        output: outputTemplate,
        format: 'bestaudio/best',
        extractAudio: true,
        audioFormat: 'mp3',
        audioQuality: 0,
        embedThumbnail: true,
        addMetadata: true,
        ffmpegLocation: this._ffmpegPath,
        noPlaylist: true,
      };

      console.info('[Download Service] Obtendo metadados do vídeo...');
      const info: any = await youtubedl(cleanUrl, {
        dumpSingleJson: true,
        noWarnings: true,
        noCheckCertificates: true,
        preferFreeFormats: true,
      });

      console.info(
        `[Download Service] Metadados obtidos - Título: ${info.title}, Duração: ${info.duration}s`
      );
      console.info(
        '[Download Service] Iniciando download e conversão para MP3...'
      );

      await youtubedl(cleanUrl, options);

      console.info('[Download Service] Download e conversão concluídos');

      const filename = `${this.sanitizeFilename(info.title)}.mp3`;
      const filepath = path.join(tempDir, filename);

      console.info(`[Download Service] Lendo arquivo: ${filename}`);
      const buffer = await fs.readFile(filepath);
      const stats = await fs.stat(filepath);

      console.info(
        `[Download Service] Arquivo lido com sucesso - Tamanho: ${stats.size} bytes`
      );

      await this.cleanupTempDir(tempDir);

      console.info(
        '[Download Service] Processo de download finalizado com sucesso'
      );

      return {
        title: info.title,
        filename,
        duration: info.duration || 0,
        size: stats.size,
        buffer,
      };
    } catch (error) {
      console.error(
        `[Download Service] Erro no processo de download: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      );

      if (tempDir) {
        await this.cleanupTempDir(tempDir);
      }

      if (error instanceof Error) {
        throw new Error(`Erro ao baixar áudio: ${error.message}`);
      }

      throw new Error('Erro desconhecido ao baixar áudio');
    }
  }

  private validateYouTubeUrl(url: string): boolean {
    return this._youtubeRegex.test(url);
  }

  private isPlaylist(url: string): boolean {
    return this._isPlaylistRegex.test(url);
  }

  private sanitizeFilename(filename: string): string {
    return filename.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').trim();
  }
}

export default DownloadService;
