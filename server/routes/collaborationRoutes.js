import { Router } from 'express';
import {
  createCollaboration,
  deleteCollaboration,
  getCollaborations,
  updateCollaboration,
} from '../controllers/collaborationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.route('/').get(getCollaborations).post(protect, createCollaboration);
router.route('/:id').put(protect, updateCollaboration).delete(protect, deleteCollaboration);

export default router;


