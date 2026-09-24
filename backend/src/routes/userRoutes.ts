import { Router } from 'express';
import { listUsers, createUser, updateUser, updateOwnProfile } from '../controllers/userController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/users', listUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.patch('/users/me', requireAuth, updateOwnProfile);

export default router;
