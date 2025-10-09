import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import youtubedl from 'youtube-dl-exec';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DOWNLOADS_DIR = path.join(__dirname, '..', 'downloads');
const FFMPEG_PATH = ffmpegInstaller.path;

if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'YTune API - YouTube Music Download Service',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      download: '/download?url=<youtube_url>',
    },
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/download', async (req: Request, res: Response) => {
  try {
    const { url } = req.query;

    // Validar URL
    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        error: 'URL do YouTube é obrigatória',
        example: '/download?url=https://www.youtube.com/watch?v=VIDEO_ID',
      });
    }

    // Validar se é uma URL válida do YouTube
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(url)) {
      return res.status(400).json({
        error: 'URL inválida do YouTube',
      });
    }

    console.log('Iniciando download:', url);

    // Usar yt-dlp para baixar e converter diretamente para MP3
    const outputTemplate = path.join(DOWNLOADS_DIR, '%(title)s.%(ext)s');

    await youtubedl(url, {
      extractAudio: true,
      audioFormat: 'mp3',
      audioQuality: 0, // Melhor qualidade
      output: outputTemplate,
      format: 'bestaudio/best',
      ffmpegLocation: FFMPEG_PATH,
    });

    // Encontrar o arquivo MP3 gerado
    const files = fs.readdirSync(DOWNLOADS_DIR);
    const mp3Files = files
      .filter(f => f.endsWith('.mp3'))
      .sort((a, b) => {
        const statA = fs.statSync(path.join(DOWNLOADS_DIR, a));
        const statB = fs.statSync(path.join(DOWNLOADS_DIR, b));
        return statB.mtimeMs - statA.mtimeMs; // Mais recente primeiro
      });

    if (mp3Files.length === 0) {
      throw new Error('Arquivo MP3 não foi gerado');
    }

    const latestFile = mp3Files[0];
    const filePath = path.join(DOWNLOADS_DIR, latestFile);

    console.log('Download concluído:', latestFile);

    res.json({
      success: true,
      message: 'Download concluído com sucesso',
      file: latestFile,
      path: filePath,
    });
  } catch (error: any) {
    console.error('Erro no download:', error);
    res.status(500).json({
      error: 'Erro ao baixar o vídeo',
      details: error.message,
    });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
