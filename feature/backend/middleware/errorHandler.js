import logger from '../utils/logger.js';
import { AppError } from '../utils/errors.js';

/**
 * Global Error Handling Middleware
 * Catches all errors and provides meaningful responses to users
 */

/**
 * Handle MongoDB/Mongoose Errors
 */
const handleMongoDBError = (err) => {
  // Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return {
      statusCode: 409,
      message: `${field} already exists`,
      isOperational: true
    };
  }
  
  // Validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return {
      statusCode: 422,
      message: 'Validation failed',
      errors,
      isOperational: true
    };
  }
  
  // Cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return {
      statusCode: 400,
      message: `Invalid ${err.path}: ${err.value}`,
      isOperational: true
    };
  }
  
  return null;
};

/**
 * Handle JWT Errors
 */
const handleJWTError = () => ({
  statusCode: 401,
  message: 'Invalid token. Please log in again.',
  isOperational: true
});

const handleJWTExpiredError = () => ({
  statusCode: 401,
  message: 'Your token has expired. Please log in again.',
  isOperational: true
});

/**
 * Send Error Response in Development
 */
const sendErrorDev = (err, res) => {
  logger.error({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  }, 'Error occurred');

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

/**
 * Send Error Response in Production
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    logger.warn({
      status: err.status,
      message: err.message
    }, 'Operational error');

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(err.errors && { errors: err.errors })
    });
  } 
  // Programming or unknown error: don't leak error details
  else {
    logger.error({
      error: err,
      message: err.message,
      stack: err.stack
    }, 'Unexpected error');

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Please try again later.'
    });
  }
};

/**
 * Global Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.status = err.status || 'error';
  error.isOperational = err.isOperational !== undefined ? err.isOperational : false;

  // Handle specific error types
  const mongoError = handleMongoDBError(err);
  if (mongoError) {
    error.statusCode = mongoError.statusCode;
    error.message = mongoError.message;
    error.isOperational = mongoError.isOperational;
    if (mongoError.errors) error.errors = mongoError.errors;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    const jwtError = handleJWTError();
    error.statusCode = jwtError.statusCode;
    error.message = jwtError.message;
    error.isOperational = jwtError.isOperational;
  }

  if (err.name === 'TokenExpiredError') {
    const jwtExpError = handleJWTExpiredError();
    error.statusCode = jwtExpError.statusCode;
    error.message = jwtExpError.message;
    error.isOperational = jwtExpError.isOperational;
  }

  // Send appropriate response
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

/**
 * Async Error Wrapper
 * Catches errors in async route handlers
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 Not Found Handler
 */
export const notFoundHandler = (req, res, next) => {
  const error = new AppError(`Cannot find ${req.originalUrl} on this server`, 404);
  next(error);
};
