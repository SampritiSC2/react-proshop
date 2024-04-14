import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync.js';
import User from '../models/user.js';
import AppError from '../utils/AppError.js';

// Protect middleware
const protect = catchAsync(async (req, res, next) => {
  let token;

  // Read token from cookies
  token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
      next();
    } catch (error) {
      return next(new AppError('Not authorized, invalid token', 401));
    }
  } else {
    return next(new AppError('Please authenticate', 401));
  }
});

// Admin middleware
const admin = catchAsync(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    next(new AppError('Not authorized as admin', 401));
  }
});

export { protect, admin };
