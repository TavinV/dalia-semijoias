import express from 'express';
import authController from '../controllers/auth-controller.js';
import { authenticateToken } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.post('/login', authController.login);
router.get('/validate-session', authenticateToken, authController.validateSession);

export default router;