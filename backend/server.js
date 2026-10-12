require('dotenv').config();
const app = require('./src/app');
const { initializeDatabase } = require('./src/config/db');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log('Connecting to database...');
    await initializeDatabase();
    console.log('Database connected & initialized successfully.');

    const server = app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(` Student Management System API`);
      console.log(` Running on: http://localhost:${PORT}`);
      console.log(` Health check: http://localhost:${PORT}/api/health`);
      console.log(` Students API: http://localhost:${PORT}/api/students`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`===============================================`);
    });

    // Graceful shutdown
    const handleShutdown = (signal) => {
      console.log(`\nReceived ${signal}. Gracefully shutting down...`);
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));

  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
