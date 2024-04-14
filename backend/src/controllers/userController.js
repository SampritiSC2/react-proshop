import catchAsync from '../utils/catchAsync.js';
import User from '../models/user.js';
import AppError from '../utils/AppError.js';
import { setJWTCookie } from '../utils/setCookie.js';
import Order from '../models/order.js';

// @desc Authenticate user and generate token
// @route POST /api/users/login
// @access public
const authUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    // Create token
    const token = await user.generateToken();

    // Add token a http-only cookie
    setJWTCookie(token, res);

    return res.json({
      _id: user._id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
    });
  } else {
    return next(new AppError('Invalid email or password', 401));
  }
});

// @desc Register user
// @route POST /api/users
// @access public
const registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError('User is already registred', 400));
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  if (user) {
    const token = await user.generateToken();
    setJWTCookie(token, res);
    return res.status(201).send({
      status: 'success',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } else {
    return next(new AppError('Invalid user details', 400));
  }
});

// @desc Logout user and clear cookie
// @route POST /api/users/logout
// @access private
const logoutUser = catchAsync(async (req, res, next) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
});

// @desc Get user profile
// @route GET /api/users/profile
// @access private
const getUserProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user) {
    return res.status(200).json({
      status: 'success',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } else {
    return next(new AppError('User not found', 404));
  }
});

// @desc Update user profile
// @route PUT /api/users/profile
// @access private
const updateUserProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.status(200).send({
      status: 'success',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      },
    });
  } else {
    return next(new AppError('User not found', 404));
  }
});

// @desc Get users
// @route GET /api/users
// @access private(admin)
const getUsers = catchAsync(async (req, res, next) => {
  const pageNumber = req.query.pageNumber || 1;
  const pageSize = process.env.PAGE_SIZE || 5;
  const count = await User.countDocuments({});
  const users = await User.find({
    _id: {
      $ne: req.user._id,
    },
  })
    .select('-password')
    .limit(pageSize)
    .skip(pageSize * (pageNumber - 1));
  res.status(200).json({
    status: 'success',
    page: pageNumber,
    pages: Math.ceil((count - 1) / pageSize),
    users: users.filter((user) => user._id !== req.user._id),
  });
});

// @desc Get user by id
// @route GET /api/users/:id
// @access private(admin)
const getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.status(200).send({
      status: 'success',
      user,
    });
  } else {
    return next(new AppError('User not found', 404));
  }
});

// @desc Delete user by id
// @route DELETE /api/users/:id
// @access private(admin)
const deleteUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      return next(new AppError('Cannot delete admin user', 400));
    }
    await User.deleteOne({ _id: user._id });

    // Delete user orders
    await Order.deleteMany({ user: user._id });

    res.status(200).send({
      status: 'success',
      message: 'User deleted successfully',
    });
  } else {
    return next(new AppError('User not found', 404));
  }
});

// @desc Update User By Id
// @route PUT /api/users/:id
// @access private(admin)

const updateUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const requiredUpdates = ['name', 'email', 'isAdmin'];
  const providedUpdates = Object.keys(req.body);
  const isPresent = requiredUpdates.every((update) => providedUpdates.includes(update));
  if (user) {
    if (!isPresent) {
      return next(new AppError('Invalid Updates', 404));
    }
    user.name = req.body.name;
    user.email = req.body.email;
    user.isAdmin = req.body.isAdmin;
    const updatedUser = await user.save();
    res.status(200).send({
      status: 'success',
      user,
    });
  } else {
    return next(new AppError('User not found', 404));
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
