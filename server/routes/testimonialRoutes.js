import { Router } from 'express';
import {
  createTestimonial,
  deleteTestimonial,
  getAdminTestimonials,
  getPublicTestimonials,
  submitTestimonial,
  toggleTestimonialApproval,
  updateTestimonial,
} from '../controllers/testimonialController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getPublicTestimonials);
router.get('/admin', protect, getAdminTestimonials);
router.post('/', protect, createTestimonial);
router.post('/submit', submitTestimonial);
router.put('/:id', protect, updateTestimonial);
router.patch('/:id/approve', protect, toggleTestimonialApproval);
router.delete('/:id', protect, deleteTestimonial);

export default router;


