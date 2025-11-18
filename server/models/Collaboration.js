import mongoose from 'mongoose';

const collaborationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String },
    logo: { type: String },
    highlight: { type: String },
  },
  {
    timestamps: true,
  }
);

const Collaboration = mongoose.model('Collaboration', collaborationSchema);

export default Collaboration;


