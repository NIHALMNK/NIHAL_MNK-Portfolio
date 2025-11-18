import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    tag: { type: String },
    description: { type: String },
    image: { type: String },
    liveUrl: { type: String },
    githubUrl: { type: String },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', projectSchema);

export default Project;


