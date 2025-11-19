// contactController.js - Enhanced version
import { validationResult } from 'express-validator';
import ContactMessage from '../models/ContactMessage.js';

export const submitContactMessage = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { name, email, message } = req.body;

    const savedMessage = await ContactMessage.create({
      name,
      email,
      message,
      meta: {
        userAgent: req.headers['user-agent'],
        referer: req.headers.referer || req.headers.referrer,
      },
    });

    res.status(201).json({
      message: 'Message sent successfully',
      id: savedMessage._id,
      name: savedMessage.name,
      email: savedMessage.email,
      createdAt: savedMessage.createdAt,
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ 
      message: 'Failed to save message. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};