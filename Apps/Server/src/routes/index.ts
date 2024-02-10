import { Router } from 'express';
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



const router = Router();



// ROUTES
// Probes
router.get('/health', HealthController);
router.get('/ready', ReadyController);

// API
router.put('/auth', LoginController);
router.delete('/auth', [AuthMiddleware], LogoutController);

router.get('/user', [AuthMiddleware], GetUserController);
router.get('/scores', [AuthMiddleware], GetScoresController);
router.get('/quiz', [AuthMiddleware], GetQuizController);
router.get('/quiz/:questionId', [AuthMiddleware], GetQuestionController);
router.post('/quiz/:questionId', [AuthMiddleware], VoteController);



export default router;