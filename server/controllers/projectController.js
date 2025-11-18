import asyncHandler from 'express-async-handler';
import Project from '../models/Project.js';

export const getProjects = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || undefined;
  const projectsQuery = Project.find().sort({ createdAt: -1 });
  if (limit) {
    projectsQuery.limit(limit);
  }
  const projects = await projectsQuery;
  res.json(projects);
});

export const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create(req.body);
  res.status(201).json(project);
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  Object.assign(project, req.body);
  const updated = await project.save();
  res.json(updated);
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  await project.deleteOne();
  res.status(204).end();
});


