// src/routes/task.routes.ts

import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { updateTask, deleteTask } from '../controllers/task.controller';

const router = Router();

// All task routes require authentication
router.use(authenticate);

router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
