/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';

import { logger } from '../logger';
import ApiError from './ApiError';

require('dotenv').config();

const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  logger.error(`Cast Error: ${message}`);
  return new ApiError(message, 400);
};


const handleDuplicateFieldsDB = (err: any) => {
  const field:any = Object.keys(err.keyPattern)[0];
  const message = { [field]: `${field} already exist` };
  logger.error(`Duplicate field error: ${JSON.stringify(message)}`);
  return new ApiError('Duplicate field error', 400, message);
};

const handleValidationErrorDB = (err: any) => {
  const fieldErrors: Record<string, string> = {};
  Object.values(err.errors).forEach((error: any) => {
    fieldErrors[error.path] = error.message;
  });
  logger.error(`Validation error: ${JSON.stringify(fieldErrors)}`);
  return new ApiError('Validation error', 400, fieldErrors);
};

// JWT error handlers
const handleJWTError = () =>
  new ApiError('Invalid token. Please log in again!', 401, {
    token: 'invalid token'
  });
const handleJWTExpiredError = () =>
  new ApiError('Your token has expired! Please log in again.', 401, {
    token: 'Token expired'
  });

// Global error handler
const sendError = (err: any, error: any, _: Request, res: Response, next?: NextFunction) => {
  const response: any = {
    status: 'fail',
    message: err.message || error.message || 'An error occurred'
  };

  // Include field-specific errors if present
  if (err.fieldErrors || error.fieldErrors) {
    response.errors = err.fieldErrors || error.fieldErrors;
  }
  if(next){
   
  }

  return res.status(err.statusCode || 400).json(response);
  
};

const GlobalError = (err: any, req: Request, _: Response, next: NextFunction) => {
  logger.error('Error:', err);


  let error = { ...err };
  error.message = err.message;

  // Customize MongoDB or JWT errors
  if (err.name === 'CastError') error = handleCastErrorDB(err);
  if (err.code === 11000) error = handleDuplicateFieldsDB(err);
  if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  return sendError(error, error, req, _, next);
};

export default GlobalError;