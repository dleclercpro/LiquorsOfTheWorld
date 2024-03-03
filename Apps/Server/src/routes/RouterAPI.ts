import { Router } from 'express';
import HealthController from '../controllers/HealthController';
import ReadyController from '../controllers/ReadyController';
import PingController from '../controllers/auth/PingController';
import LoginController from '../controllers/auth/LoginController';
import LogoutController from '../controllers/auth/LogoutController';
import GetUserController from '../controllers/user/GetUserController';
import GetQuestionsController from '../controllers/quiz/GetQuestionsController';
import VoteController from '../controllers/quiz/VoteController';
import AuthMiddleware from '../middleware/AuthMiddleware';
import GetScoresController from '../controllers/quiz/GetScoresController';
import GetStatusController from '../controllers/quiz/GetStatusController';
import GetVotesController from '../controllers/quiz/GetVotesController';
import StartQuizController from '../controllers/quiz/StartQuizController';
import StartQuestionController from '../controllers/quiz/StartQuestionController';
import DeleteQuizController from '../controllers/quiz/DeleteQuizController';
import DeleteDatabaseController from '../controllers/DeleteDatabaseController';



const router = Router();



// ROUTES
// Probes
router.get('/health', HealthController);
router.get('/ready', ReadyController);



// API
router.delete('/', [AuthMiddleware], DeleteDatabaseController);

router.put('/auth', LoginController);
router.get('/auth', [AuthMiddleware], PingController);
router.delete('/auth', [AuthMiddleware], LogoutController);

router.get('/user', [AuthMiddleware], GetUserController);

router.get('/questions/:lang', GetQuestionsController);

router.get('/quiz/:quizId', [AuthMiddleware], GetStatusController);
router.delete('/quiz/:quizId', [AuthMiddleware], DeleteQuizController);
router.put('/quiz/:quizId/start', [AuthMiddleware], StartQuizController);
router.get('/quiz/:quizId/votes', [AuthMiddleware], GetVotesController);
router.get('/quiz/:quizId/scores', [AuthMiddleware], GetScoresController);
router.post('/quiz/:quizId/question/:questionIndex', [AuthMiddleware], VoteController);
router.put('/quiz/:quizId/question/:questionIndex/start', [AuthMiddleware], StartQuestionController);



export default router;