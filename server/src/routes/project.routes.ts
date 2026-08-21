// src/routes/project.routes.ts

import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getProjects, getProject, createProject } from '../controllers/project.controller';
import { getProjectTasks, createTask } from '../controllers/task.controller';

const router = Router();

// All project routes require authentication
router.use(authenticate);

router.get('/', getProjects);
router.post('/', createProject);
router.get('/:id', getProject);

// Task routes nested under project
router.get('/:id/tasks', getProjectTasks);
router.post('/:id/tasks', createTask);

export default router;
