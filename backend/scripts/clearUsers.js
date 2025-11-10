import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.model.js';

dotenv.config();

const clearUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const result = await User.deleteMany({});
    console.log(`Deleted ${result.deletedCount} users`);

    console.log('All users cleared successfully');
  } catch (error) {
    console.error('Error clearing users:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

clearUsers();
