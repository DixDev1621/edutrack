const express = require('express');
const router = express.Router();
const { getDatabase } = require('../config/db');

router.get('/', async (req, res) => {
  let dbStatus = 'disconnected';
  let totalStudents = 0;

  try {
    const db = getDatabase();
    const result = await db.get('SELECT COUNT(*) as count FROM students');
    dbStatus = 'connected';
    totalStudents = result ? result.count : 0;
  } catch (err) {
    dbStatus = `error: ${err.message}`;
  }

  const memoryUsage = process.memoryUsage();

  res.json({
    status: 'ok',
    service: 'Student Management System API',
    uptime: `${Math.floor(process.uptime())} seconds`,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      type: 'SQLite',
      status: dbStatus,
      totalRecords: totalStudents
    },
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`
    }
  });
});

module.exports = router;
