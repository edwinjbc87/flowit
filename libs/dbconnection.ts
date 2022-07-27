import mongoose from 'mongoose';

const dbconnect = async () => mongoose.connect(process.env.MONGODB_URI+'', {dbName: process.env.MONGODB_NAME});

export default dbconnect;