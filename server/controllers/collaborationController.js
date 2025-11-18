import asyncHandler from 'express-async-handler';
import Collaboration from '../models/Collaboration.js';

export const getCollaborations = asyncHandler(async (req, res) => {
  const collaborations = await Collaboration.find().sort({ createdAt: -1 });
  res.json(collaborations);
});

export const createCollaboration = asyncHandler(async (req, res) => {
  const collaboration = await Collaboration.create(req.body);
  res.status(201).json(collaboration);
});

export const updateCollaboration = asyncHandler(async (req, res) => {
  const collaboration = await Collaboration.findById(req.params.id);
  if (!collaboration) {
    res.status(404);
    throw new Error('Collaboration not found');
  }
  Object.assign(collaboration, req.body);
  const updated = await collaboration.save();
  res.json(updated);
});

export const deleteCollaboration = asyncHandler(async (req, res) => {
  const collaboration = await Collaboration.findById(req.params.id);
  if (!collaboration) {
    res.status(404);
    throw new Error('Collaboration not found');
  }
  await collaboration.deleteOne();
  res.status(204).end();
});


