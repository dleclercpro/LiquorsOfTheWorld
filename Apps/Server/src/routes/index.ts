import express, { Router } from 'express';
import HealthController from '../controllers/HealthController';
import ReadyController from '../controllers/ReadyController';
import LoginController from '../controllers/LoginController';
import LogoutController from '../controllers/LogoutController';
import GetUserController from '../controllers/GetUserController';
import GetQuizController from '../controllers/GetQuizController';
import GetQuestionController from '../controllers/GetQuestionController';
import VoteController from '../controllers/VoteController';
import AuthMiddleware from '../middleware/AuthMiddleware';
import GetScoresController from '../controllers/GetScoresController';
import path from 'path';
import { CLIENT_DIR, CLIENT_ROOT, PROD } from '../config';
import logger from '../logger';



const router = Router();



// Client app
if (PROD) {

  // Serve React app's static files
  router.use(express.static(CLIENT_DIR));

  // Define a route that serves the React app
  router.get('*', (req, res) => {
      const url = path.join(CLIENT_DIR, 'index.html');

      logger.trace(`Serving client app from: ${url}`);

      return res.sendFile(url);
  });
} else {
  
  // Redirect app to React's development server
  router.get('*', (req, res, next) => {
      const path = req.originalUrl;
      const url = `${CLIENT_ROOT}${path}`;

      logger.trace(`Redirecting request to: ${url}`);

      return res.redirect(url);
  });
}



// ROUTES
// Probes
router.get('/health', HealthController);
router.get('/ready', ReadyController);

// API
router.put('/auth', LoginController);
router.delete('/auth', [AuthMiddleware], LogoutController);

router.get('/user', [AuthMiddleware], GetUserController);
router.get('/scores', [AuthMiddleware], GetScoresController);

router.get('/quiz', GetQuizController);
router.get('/quiz/:questionId', [AuthMiddleware], GetQuestionController);
router.post('/quiz/:questionId', [AuthMiddleware], VoteController);



export default router;