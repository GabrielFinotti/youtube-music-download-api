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
      await fs.rm(dirPath, { recursive: true, force: true });
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
      if (!this.validateYouTubeUrl(url)) {
        throw new Error('URL do YouTube inválida');
      }

      const isPlaylistUrl = this.isPlaylist(url);
      const cleanUrl = isPlaylistUrl ? this.extractVideoUrl(url) : url;

      tempDir = await this.createTempDir();

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
      const info: any = await youtubedl(cleanUrl, {
        dumpSingleJson: true,
        noWarnings: true,
        noCheckCertificates: true,
        preferFreeFormats: true,
      });

      await youtubedl(cleanUrl, options);

      const filename = `${this.sanitizeFilename(info.title)}.mp3`;
      const filepath = path.join(tempDir, filename);

      const buffer = await fs.readFile(filepath);
      const stats = await fs.stat(filepath);

      await this.cleanupTempDir(tempDir);

      return {
        title: info.title,
        filename,
        duration: info.duration || 0,
        size: stats.size,
        buffer,
      };
    } catch (error) {
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
