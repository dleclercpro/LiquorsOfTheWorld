import { Router } from 'express';
import HealthController from '../controllers/HealthController';
import ReadyController from '../controllers/ReadyController';
import LoginController from '../controllers/auth/LoginController';
import LogoutController from '../controllers/auth/LogoutController';
import GetUserController from '../controllers/user/GetUserController';
import GetQuizController from '../controllers/GetQuizController';
import VoteController from '../controllers/VoteController';
import AuthMiddleware from '../middleware/AuthMiddleware';
import GetScoresController from '../controllers/GetScoresController';
import RequestMiddleware from '../middleware/RequestMiddleware';
import GetQuestionIndexController from '../controllers/GetQuestionIndexController';



const router = Router();



// Log every request
router.use(RequestMiddleware);



// ROUTES
// Probes
router.get('/health', HealthController);
router.get('/ready', ReadyController);



// API
router.put('/auth', LoginController);
router.delete('/auth', [AuthMiddleware], LogoutController);

router.get('/user', [AuthMiddleware], GetUserController);

router.get('/quiz', GetQuizController);
router.get('/quiz/:quizId', [AuthMiddleware], GetQuestionIndexController);
router.post('/quiz/:quizId/question/:questionIndex', [AuthMiddleware], VoteController);
router.get('/quiz/:quizId/scores', [AuthMiddleware], GetScoresController);



export default router;