import { Router } from 'express';
import {
  createStarterProject,
  deleteStarterProject,
  getStarterProjects,
  likeStarterProject,
  updateStarterProject,
} from '../controllers/starterProjectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.route('/').get(getStarterProjects).post(protect, createStarterProject);
router.route('/:id').put(protect, updateStarterProject).delete(protect, deleteStarterProject);
router.post('/:id/like', likeStarterProject);

export default router;


