import AppError from '../utils/AppError.js';

const handleCastErrorObjectId = (error) => {
  const message = `Resource not found for path ${error.path} ${error.value}`;
  return new AppError(message, 404);
};

const handleValidationError = (error) => {
  const errorMessages = [];
  Object.keys(error?.errors).forEach((key) => {
    errorMessages.push(error?.errors?.[key]?.message);
  });
  return new AppError(errorMessages.join(' '), 400);
};

const handleDuplicateKeyError = (error) => {
  const regex = /: "(.*?)"/;
  const match = error.message.match(regex);
  const key = Object.keys(error.keyValue)[0];

  if (match && match[1]) {
    const message = `Duplicate ${key} '${match[1]}'`;
    return new AppError(message, 400);
  }
  return error;
};

const sendErrorDev = (res, error) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stack: error.stack,
    error,
  });
};

const sendErrorProd = (res, error) => {
  // We create the error
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    // If it was any other kind of error
    res.status(500).send({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

const globalErrorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';
  if (process.env.NODE_ENV === 'production') {
    let modifiedError = { ...error };
    modifiedError.message = error.message;

    // Handle Cast Error for ObjectId
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      modifiedError = handleCastErrorObjectId(error);
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      modifiedError = handleDuplicateKeyError(error);
    }

    // Handle Validation Erros
    if (error.name === 'ValidationError') {
      modifiedError = handleValidationError(error);
    }

    sendErrorProd(res, modifiedError);
  } else {
    sendErrorDev(res, error);
  }
};

export default globalErrorHandler;
