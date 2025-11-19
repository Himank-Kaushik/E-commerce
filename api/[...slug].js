const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
require('../passport/setup'); // passport / prisma setup
const authRoutes = require('../routes/auth.routes');

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());

// mount routes under /auth (will be available at /api/auth/...)
app.use('/auth', authRoutes);

// simple healthcheck at /api/
app.get('/', (req, res) => res.send('Beauty Zone API (serverless)'));

module.exports = serverless(app);
