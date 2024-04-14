import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash Plain Text password
userSchema.pre('save', async function (next) {
  const currentUser = this;
  if (currentUser.isModified('password')) {
    const hashedPassword = await bcrypt.hash(currentUser.password, 12);
    currentUser.password = hashedPassword;
  }
  next();
});

// Check if provided password is correct
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate auth jwt token
userSchema.methods.generateToken = async function () {
  const currentUser = this;
  const token = jwt.sign({ userId: currentUser._id }, process.env.JWT_SECRET, {
    expiresIn: '30 days',
  });
  return token;
};

const User = mongoose.model('User', userSchema);

export default User;
