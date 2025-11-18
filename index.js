require('dotenv').config();
const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport');
const cors = require('cors');
require('./passport/setup'); // Import passport config
const authRoutes = require('./routes/auth.routes');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;
// --- Middleware ---
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3002", "http://localhost:3003"], // Allow frontend to make requests
    credentials: true,
  })
);

app.use(
  cookieSession({
    name: 'beauty-zone-session',
    keys: [process.env.COOKIE_KEY],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

app.use(passport.initialize());
app.use(passport.session());

// --- Middleware ---
app.use(express.json()); // Parse JSON bodies

// --- Routes ---
app.use('/auth', authRoutes); // All auth routes (/auth/google, /auth/logout, /auth/signup, /auth/login)

// Test API route to check user status (protected for JWT users)
app.get('/api/current_user', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  require('jsonwebtoken').verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    try {
      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      if (!dbUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ id: dbUser.id, email: dbUser.email, name: dbUser.name });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});