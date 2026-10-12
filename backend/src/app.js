const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const studentRoutes = require('./routes/studentRoutes');
const healthRoutes = require('./routes/healthRoutes');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');

const app = express();

// Determine allowed CORS origins
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    // In development or if wildcard specified
    if (process.env.NODE_ENV !== 'production' || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    // If client deployed on Vercel preview URLs or matching domain
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(new Error(`CORS origin not allowed: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP logger
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Student Management System API',
    documentation: {
      health: 'GET /api/health',
      students: 'GET /api/students',
      stats: 'GET /api/students/stats',
      createStudent: 'POST /api/students',
      updateStudent: 'PUT /api/students/:id',
      deleteStudent: 'DELETE /api/students/:id',
      seed: 'POST /api/students/seed'
    }
  });
});

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/students', studentRoutes);

// Catch 404 and forward to error handler
app.use(notFoundHandler);

// Centralized error handler
app.use(globalErrorHandler);

module.exports = app;
