import { Router } from 'express';
import DownloadController from '../controllers/download.controller';

const route = Router();
const downloadController = new DownloadController();

route.get('/download', (req, res) => downloadController.download(req, res));

const downloadRoute = route;

export default downloadRoute;
