import { Router } from 'express';
import HealthController from '../controllers/HealthController';
import ReadyController from '../middleware/ReadyController';
import AddPlayerController from '../controllers/AddPlayerController';
import GetPlayerController from '../controllers/GetPlayerController';
import GetQuizController from '../controllers/GetQuizController';
import GetQuestionController from '../controllers/GetQuestionController';



const router = Router();



// ROUTES
// Probes
router.get('/health', HealthController);
router.get('/ready', ReadyController);

// API
router.get('/player', GetPlayerController);
router.post('/player', AddPlayerController);
router.get('/quiz', GetQuizController);
router.get('/quiz/:questionId', GetQuestionController);



export default router;