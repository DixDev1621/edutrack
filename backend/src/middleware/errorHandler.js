/**
 * Centralized error handler middleware
 */

function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
}

function globalErrorHandler(err, req, res, next) {
  console.error('Unhandled Application Error:', err);

  // SQLite constraint error handling
  if (err.message && err.message.includes('UNIQUE constraint failed')) {
    if (err.message.includes('students.roll_number')) {
      return res.status(409).json({
        success: false,
        message: 'A student with this Roll Number / Student ID already exists.'
      });
    }
    if (err.message.includes('students.email')) {
      return res.status(409).json({
        success: false,
        message: 'A student with this Email address already exists.'
      });
    }
    return res.status(409).json({
      success: false,
      message: 'Duplicate record exists with the same unique value.'
    });
  }

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error occurred.',
    error: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
}

module.exports = {
  notFoundHandler,
  globalErrorHandler
};
