import { Router } from 'express';
import HealthController from '../controllers/HealthController';
import ReadyController from '../controllers/ReadyController';
import LoginController from '../controllers/LoginController';
import GetUserController from '../controllers/GetUserController';
import GetQuizController from '../controllers/GetQuizController';
import GetQuestionController from '../controllers/GetQuestionController';
import VoteController from '../controllers/VoteController';
import AuthMiddleware from '../middleware/AuthMiddleware';



const router = Router();



// ROUTES
// Probes
router.get('/health', HealthController);
router.get('/ready', ReadyController);

// API
router.put('/auth', LoginController);
router.get('/player', [AuthMiddleware], GetUserController);
router.get('/quiz', [AuthMiddleware], GetQuizController);
router.get('/quiz/:questionId', [AuthMiddleware], GetQuestionController);
router.post('/quiz/:questionId', [AuthMiddleware], VoteController);



export default router;