import { Request, Response } from 'express';
import DownloadService from '../services/download.service';
import ApiResponse from '../utils/api/apiResponse';

class DownloadController {
  private downloadService!: DownloadService;

  constructor() {
    this.downloadService = DownloadService.getInstance();
  }

  async download(req: Request, res: Response) {
    try {
      const { url } = req.query;

      if (!url || typeof url !== 'string') {
        return res
          .status(400)
          .json(
            ApiResponse.error(
              400,
              'URL é obrigatória',
              'Forneça uma URL válida do YouTube como query parameter'
            )
          );
      }

      const result = await this.downloadService.download(url);

      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${encodeURIComponent(result.filename)}"`
      );
      res.setHeader('Content-Length', result.size);
      res.setHeader('X-Track-Title', encodeURIComponent(result.title));
      res.setHeader('X-Track-Duration', result.duration.toString());

      res.send(result.buffer);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';

      res
        .status(500)
        .json(
          ApiResponse.error(500, 'Erro ao processar download', errorMessage)
        );
    }
  }
}

export default DownloadController;
