import { Router } from 'express';
import HealthController from '../controllers/HealthController';
import ReadyController from '../middleware/ReadyController';
import LoginController from '../controllers/LoginController';
import GetPlayerController from '../controllers/GetPlayerController';
import GetQuizController from '../controllers/GetQuizController';
import GetQuestionController from '../controllers/GetQuestionController';



const router = Router();



// ROUTES
// Probes
router.get('/health', HealthController);
router.get('/ready', ReadyController);

// API
router.put('/auth', LoginController);
router.get('/player', GetPlayerController);
router.get('/quiz', GetQuizController);
router.get('/quiz/:questionId', GetQuestionController);



export default router;