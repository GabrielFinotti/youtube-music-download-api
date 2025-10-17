import { Request, Response } from 'express';
import DownloadService from '../services/download.service';
import ApiResponse from '../utils/api/apiResponse';
import Logger from '../utils/logger/logger';

class DownloadController {
  private downloadService!: DownloadService;
  private logger = Logger.createChildLogger('DownloadController');

  constructor() {
    this.downloadService = DownloadService.getInstance();
  }

  async download(req: Request, res: Response) {
    try {
      const { url } = req.query;

      this.logger.info('Nova requisição de download recebida');

      if (!url || typeof url !== 'string') {
        this.logger.warn('Requisição rejeitada: URL ausente ou inválida');
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

      this.logger.info({ url }, 'Processando URL');
      const result = await this.downloadService.download(url);
      this.logger.info(
        { title: result.title, size: result.size },
        'Download concluído com sucesso'
      );

      res.setHeader('Content-Type', 'audio/mp4');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${encodeURIComponent(result.filename)}"`
      );
      res.setHeader('Content-Length', result.size);
      res.setHeader('X-Track-Title', encodeURIComponent(result.title));
      res.setHeader('X-Track-Duration', result.duration.toString());

      res.send(result.buffer);
      this.logger.debug('Resposta enviada ao cliente');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';

      this.logger.error({ err: error }, 'Erro no processamento');
      res
        .status(500)
        .json(
          ApiResponse.error(500, 'Erro ao processar download', errorMessage)
        );
    }
  }
}

export default DownloadController;
