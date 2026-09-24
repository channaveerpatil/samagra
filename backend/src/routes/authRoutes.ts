import { Router } from 'express';
import { forgotPassword, login, logout, me, register } from '../controllers/authController';

const router = Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/logout', logout);
router.get('/auth/me', me);

export default router;
