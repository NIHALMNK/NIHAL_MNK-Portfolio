import asyncHandler from 'express-async-handler';
import Testimonial from '../models/Testimonial.js';

export const getPublicTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({ approved: true }).sort({ order: 1, createdAt: -1 });
  res.json(testimonials);
});

export const getAdminTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find().sort({ createdAt: -1 });
  res.json(testimonials);
});

export const submitTestimonial = asyncHandler(async (req, res) => {
  const { name, quote } = req.body;
  if (!name || !quote) {
    res.status(400);
    throw new Error('Name and quote are required');
  }
  const testimonial = await Testimonial.create({
    name,
    quote,
    role: req.body.role,
    company: req.body.company,
    avatar: req.body.avatar,
    approved: false,
  });
  res.status(201).json({
    message: 'Thank you! Your testimonial was submitted for review.',
    testimonial,
  });
});

export const createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.create(req.body);
  res.status(201).json(testimonial);
});

export const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found');
  }
  Object.assign(testimonial, req.body);
  const updated = await testimonial.save();
  res.json(updated);
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found');
  }
  await testimonial.deleteOne();
  res.status(204).end();
});

export const toggleTestimonialApproval = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found');
  }
  testimonial.approved = Boolean(req.body.approved);
  const updated = await testimonial.save();
  res.json(updated);
});


