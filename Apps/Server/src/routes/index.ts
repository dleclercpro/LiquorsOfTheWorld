import express, { Router } from 'express';
import path from 'path';
import { API_VERSION, CLIENT_DIR, PROD, PUBLIC_DIR } from '../config';
import RouterAPI from './RouterAPI';
import logger from '../logger';
import RequestMiddleware from '../middleware/RequestMiddleware';



const router = Router();

// Log every request
router.use(RequestMiddleware);



// ROUTES
// API endpoints
router.use(`/api/${API_VERSION}`, RouterAPI);

// Public static files
router.use('/static', express.static(PUBLIC_DIR));
logger.debug(`Serving static files from: ${PUBLIC_DIR}`);

// Client app
if (PROD) {

  // Serve React app's static files on root URL
  router.use('/', express.static(CLIENT_DIR));
  logger.debug(`Serving client app static files from: ${CLIENT_DIR}`);

  // For every other route: serve React app
  router.get('*', (_, res) => {
      const url = path.join(CLIENT_DIR, 'index.html');

      return res.sendFile(url);
  });
}



export default router;