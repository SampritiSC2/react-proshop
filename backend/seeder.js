import mongoose from 'mongoose';
import colors from 'colors';
import dotenv from 'dotenv';
import connectDB from './src/db/db.js';
import users from './data/users.js';
import products from './data/products.js';
import User from './src/models/user.js';
import Product from './src/models/product.js';
import Order from './src/models/order.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // Delete existing data
    await Product.deleteMany();
    await Order.deleteMany();
    await User.deleteMany();

    // Insert users data to database
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    // Add user field to each product object
    const sampleProducts = products.map((product) => {
      return {
        ...product,
        user: adminUser,
      };
    });

    // Insert products data to database
    await Product.insertMany(sampleProducts);
    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await Order.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-destroy') {
  destroyData();
} else {
  importData();
}
