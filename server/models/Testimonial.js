import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String },
    company: { type: String },
    quote: { type: String, required: true },
    avatar: { type: String },
    approved: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;


