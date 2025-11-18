import { Router } from 'express';
import { body } from 'express-validator';
import { submitContactMessage } from '../controllers/contactController.js';

const router = Router();

const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message should be at least 10 characters'),
];

router.post('/', contactValidation, submitContactMessage);

export default router;

