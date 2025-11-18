import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

const REQUIRED_KEYS = ['JWT_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'];

const getEnvValue = (key) => {
  const raw = process.env[key];
  if (!raw) return null;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const ensureEnv = () => {
  const missing = REQUIRED_KEYS.filter((key) => !getEnvValue(key));
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

const generateToken = () =>
  jwt.sign(
    {
      role: 'admin',
      email: getEnvValue('ADMIN_EMAIL'),
    },
    getEnvValue('JWT_SECRET'),
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    }
  );

export const loginAdmin = asyncHandler(async (req, res) => {
  ensureEnv();

  const { email, password } = req.body;
    console.log("req.body---->",email, password);

    
  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const expectedEmail = getEnvValue('ADMIN_EMAIL');
  const expectedPassword = getEnvValue('ADMIN_PASSWORD');
  console.log("expected---->",expectedEmail, expectedPassword);
  

  if (email !== expectedEmail || password !== expectedPassword) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const user = {
    name: process.env.ADMIN_NAME || 'Portfolio Admin',
    email: expectedEmail,
  };
  console.log("user---->",user);
  

  const token = generateToken();

  res.json({
    token,
    user,
  });
});


