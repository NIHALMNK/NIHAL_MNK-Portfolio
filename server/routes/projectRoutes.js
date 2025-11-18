import { Router } from 'express';
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.route('/').get(getProjects).post(protect, createProject);
router.route('/:id').put(protect, updateProject).delete(protect, deleteProject);

export default router;


