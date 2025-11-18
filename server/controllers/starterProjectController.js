import asyncHandler from 'express-async-handler';
import StarterProject from '../models/StarterProject.js';

export const getStarterProjects = asyncHandler(async (req, res) => {
  const projects = await StarterProject.find().sort({ createdAt: -1 });
  res.json(projects);
});

export const createStarterProject = asyncHandler(async (req, res) => {
  const project = await StarterProject.create(req.body);
  res.status(201).json(project);
});

export const updateStarterProject = asyncHandler(async (req, res) => {
  const project = await StarterProject.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Starter project not found');
  }
  Object.assign(project, req.body);
  const updated = await project.save();
  res.json(updated);
});

export const deleteStarterProject = asyncHandler(async (req, res) => {
  const project = await StarterProject.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Starter project not found');
  }
  await project.deleteOne();
  res.status(204).end();
});

export const likeStarterProject = asyncHandler(async (req, res) => {
  const project = await StarterProject.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Starter project not found');
  }
  project.likes += 1;
  const updated = await project.save();
  res.json({ likes: updated.likes, _id: updated._id });
});


