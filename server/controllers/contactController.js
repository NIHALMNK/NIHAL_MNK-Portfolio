import { validationResult } from 'express-validator';
import ContactMessage from '../models/ContactMessage.js';

export const submitContactMessage = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
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
      id: savedMessage._id,
      name: savedMessage.name,
      email: savedMessage.email,
      message: savedMessage.message,
      createdAt: savedMessage.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

