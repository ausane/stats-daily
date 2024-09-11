import mongoose from "mongoose";

export type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Extend the NodeJS global object
declare global {
  var mongoose: MongooseCache;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

const connectToDatabase = async (): Promise<typeof mongoose> => {
  const uri = process.env.MONGODB_URI;

  if (!uri)
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local",
    );

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectToDatabase;
