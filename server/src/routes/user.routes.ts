// src/routes/user.routes.ts
// User listing routes — used for task assignee selection.

import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getUsers } from '../controllers/user.controller';

const router = Router();

router.use(authenticate);

// GET /api/users — list all users (for assignee dropdown)
router.get('/', getUsers);

export default router;
