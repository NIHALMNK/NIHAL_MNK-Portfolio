import asyncHandler from 'express-async-handler';
import SiteCopy from '../models/SiteCopy.js';
import Project from '../models/Project.js';
import Collaboration from '../models/Collaboration.js';
import StarterProject from '../models/StarterProject.js';
import Testimonial from '../models/Testimonial.js';
import defaultContent from '../data/siteContent.js';

const ensureSiteCopy = async () => {
  let copy = await SiteCopy.findOne();
  if (!copy) {
    copy = await SiteCopy.create(defaultContent);
  }
  return copy;
};

export const getSiteCopy = asyncHandler(async (req, res) => {
  const copy = await ensureSiteCopy();
  res.json(copy);
});

export const updateSiteCopy = asyncHandler(async (req, res) => {
  const copy = await ensureSiteCopy();
  Object.assign(copy, req.body);
  const updated = await copy.save();
  res.json(updated);
});

export const getSiteContent = asyncHandler(async (req, res) => {
  const copy = await ensureSiteCopy();
  const [projects, collaborations, starterProjects, testimonials] = await Promise.all([
    Project.find().sort({ order: 1, createdAt: -1 }),
    Collaboration.find().sort({ order: 1, createdAt: -1 }),
    StarterProject.find().sort({ order: 1, createdAt: -1 }),
    Testimonial.find({ approved: true }).sort({ order: 1, createdAt: -1 }),
  ]);

  res.json({
    ...copy.toObject(),
    projects,
    collaborations,
    starterProjects,
    testimonials,
  });
});


