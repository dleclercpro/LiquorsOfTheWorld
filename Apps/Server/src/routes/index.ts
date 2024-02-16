import express, { Router } from 'express';
import path from 'path';
import { API_VERSION, CLIENT_DIR, PROD } from '../config';
import API from './API';



const router = Router();



// ROUTES
// API endpoints
router.use(`/api/${API_VERSION}`, API)

// Public static files
router.use('/static', express.static('public'));

// Client app
if (PROD) {

  // Serve React app's static files
  router.use(express.static(CLIENT_DIR));

  // Define a route that serves the React app
  router.get('*', (req, res) => {
      const url = path.join(CLIENT_DIR, 'index.html');

      return res.sendFile(url);
  });
}



export default router;