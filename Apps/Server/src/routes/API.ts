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
import RequestMiddleware from '../middleware/RequestMiddleware';



const router = Router();



// Log every request
router.use(RequestMiddleware);



// ROUTES
// Probes
router.get('/api/v1/health', HealthController);
router.get('/ready', ReadyController);



// API
router.put('/auth', LoginController);
router.delete('/auth', [AuthMiddleware], LogoutController);

router.get('/user', [AuthMiddleware], GetUserController);
router.get('/scores', [AuthMiddleware], GetScoresController);

router.get('/quiz', GetQuizController);
router.get('/quiz/:questionIndex', [AuthMiddleware], GetQuestionController);
router.post('/quiz/:questionIndex', [AuthMiddleware], VoteController);



export default router;