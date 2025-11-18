import { Router } from 'express';
import { getSiteContent, getSiteCopy, updateSiteCopy } from '../controllers/contentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getSiteContent);
router.route('/copy').get(getSiteCopy).put(protect, updateSiteCopy);

export default router;

