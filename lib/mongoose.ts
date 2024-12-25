import mongoose, { Mongoose } from 'mongoose';

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
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            dbName: 'Dev_Overflow',
        })
        .then((mongoose) => {
            console.log('Connected to MongoDB');
            return mongoose;
        })
        .catch((err) => {
            console.log(err);
            throw new Error('Failed to connect to MongoDB');
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;