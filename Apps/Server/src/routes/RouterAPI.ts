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
import GetVersionController from '../controllers/app/GetVersionController';
import GetQuizzesController from '../controllers/quiz/GetQuizzesController';
import GetBackgroundUrlController from '../controllers/app/GetBackgroundUrlController';
import GetPlayersController from '../controllers/quiz/GetPlayersController';
import GetTeamsController from '../controllers/quiz/GetTeamsController';
import { DEBUG } from '../config';



const router = Router();



// ROUTES
// Probes
router.get('/health', HealthController);
router.get('/ready', ReadyController);



// API
router.delete('/', DEBUG ? [] : [AuthMiddleware], DeleteDatabaseController);

router.get('/auth', PingController);
router.put('/auth', LoginController);
router.delete('/auth', [AuthMiddleware], LogoutController);

router.get('/version', GetVersionController);
router.get('/bg/:quizName', GetBackgroundUrlController);
router.get('/user', [AuthMiddleware], GetUserController);

router.get('/quiz/:quizId', [AuthMiddleware], GetStatusController);
router.put('/quiz/:quizId', [AuthMiddleware], StartQuizController);
router.delete('/quiz/:quizId', [AuthMiddleware], DeleteQuizController);

router.put('/quiz/:quizId/question/:questionIndex', [AuthMiddleware], StartQuestionController);
router.post('/quiz/:quizId/question/:questionIndex', [AuthMiddleware], VoteController);

router.get('/quiz/:quizId/teams', [AuthMiddleware], GetTeamsController);
router.get('/quiz/:quizId/votes', [AuthMiddleware], GetVotesController);
router.get('/quiz/:quizId/players', [AuthMiddleware], GetPlayersController);
router.get('/quiz/:quizId/scores', [AuthMiddleware], GetScoresController);

router.get('/quizzes', GetQuizzesController);
router.get('/questions/:language/:quizName', GetQuestionsController);



export default router;