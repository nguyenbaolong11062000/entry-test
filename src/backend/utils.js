import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// eslint-disable-next-line import/prefer-default-export
export const sleep = second =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, second * 1000);
  });

export const startMongoDB = async () => {
  global.MONGODB_INSTANCE = await MongoMemoryServer.create({});
  const uri = global.MONGODB_INSTANCE.getUri();
  // mongoose.set('debug', true);
  mongoose.startSession = () => null;
  // mongoose.set('strictPopulate', false);
  mongoose.set('strictQuery', false);
  await mongoose.connect(uri);
};

export const stopMongoDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await global.MONGODB_INSTANCE.stop();
};