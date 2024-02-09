import express, { Router } from 'express';
import HealthController from '../controllers/HealthController';
import ReadyController from '../controllers/ReadyController';



const router = Router();



// Public files
router.use('/', express.static('public'));



// ROUTES
// Probes
router.get('/health', HealthController);
router.get('/ready', ReadyController);



export default router;