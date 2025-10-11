import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import youtubedl from 'youtube-dl-exec';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';
import { randomUUID } from 'crypto';
import Logger from '../utils/logger/logger';

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
  private logger = Logger.createChildLogger('DownloadService');

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
      this.logger.info({ dir: dirPath }, 'Limpando diretório temporário');
      await fs.rm(dirPath, { recursive: true, force: true });
      this.logger.debug('Diretório temporário removido com sucesso');
    } catch (error) {
      this.logger.error(
        { err: error, dir: dirPath },
        'Erro ao limpar diretório temporário'
      );
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
      this.logger.info({ url }, 'Iniciando processo de download');

      if (!this.validateYouTubeUrl(url)) {
        this.logger.warn({ url }, 'URL do YouTube inválida');
        throw new Error('URL do YouTube inválida');
      }

      this.logger.debug('URL validada com sucesso');

      const isPlaylistUrl = this.isPlaylist(url);
      const cleanUrl = isPlaylistUrl ? this.extractVideoUrl(url) : url;

      if (isPlaylistUrl) {
        this.logger.info(
          { originalUrl: url, extractedUrl: cleanUrl },
          'URL de playlist detectada, extraindo vídeo'
        );
      }

      tempDir = await this.createTempDir();
      this.logger.info({ dir: tempDir }, 'Diretório temporário criado');

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

      this.logger.info('Obtendo metadados do vídeo...');
      const info: any = await youtubedl(cleanUrl, {
        dumpSingleJson: true,
        noWarnings: true,
        noCheckCertificates: true,
        preferFreeFormats: true,
      });

      this.logger.info(
        { title: info.title, duration: info.duration },
        'Metadados obtidos'
      );
      this.logger.info('Iniciando download e conversão para MP3...');

      await youtubedl(cleanUrl, options);

      this.logger.info('Download e conversão concluídos');

      const filename = `${this.sanitizeFilename(info.title)}.mp3`;
      const filepath = path.join(tempDir, filename);

      this.logger.debug({ filename }, 'Lendo arquivo');
      const buffer = await fs.readFile(filepath);
      const stats = await fs.stat(filepath);

      this.logger.info({ size: stats.size }, 'Arquivo lido com sucesso');

      await this.cleanupTempDir(tempDir);

      this.logger.info('Processo de download finalizado com sucesso');

      return {
        title: info.title,
        filename,
        duration: info.duration || 0,
        size: stats.size,
        buffer,
      };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          { err: error.message, url },
          'Erro no processo de download'
        );
      } else {
        this.logger.error(
          { err: error, url },
          'Erro desconhecido no processo de download'
        );
      }
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
