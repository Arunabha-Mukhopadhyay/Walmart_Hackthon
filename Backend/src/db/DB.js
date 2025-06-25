import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config(); 
const MONGO_URI = process.env.MONGODB_URI 

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(MONGO_URI);
    console.log(`\nConnected to MongoDB host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); 
  }
};
export default connectDB;