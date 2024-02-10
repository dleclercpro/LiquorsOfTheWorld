import { Router } from 'express';
import HealthController from '../controllers/HealthController';
import ReadyController from '../controllers/ReadyController';
import AddPlayerController from '../controllers/AddPlayerController';



const router = Router();



// ROUTES
// Probes
router.get('/health', HealthController);
router.get('/ready', ReadyController);

// API
router.post('/player', AddPlayerController);



export default router;