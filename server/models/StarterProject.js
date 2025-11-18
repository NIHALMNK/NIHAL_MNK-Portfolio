import mongoose from 'mongoose';

const starterProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    learnMoreUrl: { type: String },
    likes: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const StarterProject = mongoose.model('StarterProject', starterProjectSchema);

export default StarterProject;


