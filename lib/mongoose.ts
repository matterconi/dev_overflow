import mongoose, { Mongoose } from 'mongoose';
import logger from './logger';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var mongoose: MongooseCache;
}

let cached = global.mongoose as MongooseCache;

if (!cached) {
    cached = { conn: null, promise: null };
    global.mongoose = cached;
}

const dbConnect = async (): Promise<Mongoose> => {
    if (cached.conn) {
        logger.info('Using existing MongoDB connection');
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            dbName: 'Dev_Overflow',
        })
        .then((mongoose) => {
            logger.info('Connected to MongoDB');
            return mongoose;
        })
        .catch((err) => {
            logger.error('Error connecting to MongoDb', err);
            throw err;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;