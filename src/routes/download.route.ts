import { Router } from 'express';

const route = Router();

route.get('/download');

const downloadRoute = route;

export default downloadRoute;
