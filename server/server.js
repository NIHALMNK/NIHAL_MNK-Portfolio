import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db.js';
import contentRoutes from './routes/contentRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import collaborationRoutes from './routes/collaborationRoutes.js';
import starterProjectRoutes from './routes/starterProjectRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();
connectDB();

const app = express();
const __dirname = path.resolve();

// FORCE CORS FIRST
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://nihal-mnk-portfolio.onrender.com");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  
  next();
});

// Then add cors() for safety
app.use(cors({
  origin: "https://nihal-mnk-portfolio.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// app.use(cors());

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Default route
app.get("/", (req, res) => {
  res.json({ message: "Portfolio API is running" });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/projects", projectRoutes);
app.use("/api/collaborations", collaborationRoutes);
app.use("/api/starter-projects", starterProjectRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/uploads", uploadRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
