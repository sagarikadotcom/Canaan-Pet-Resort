import mongoose, { Connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;
console.log("MONGODB_URI", MONGODB_URI);

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Define a type for the cached connection object
interface MongooseCache {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

// Use a global cache to store the connection
const globalCache = global as typeof globalThis & { mongoose?: MongooseCache };

if (!globalCache.mongoose) {
  globalCache.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<Connection> {
  if (globalCache.mongoose?.conn) return globalCache.mongoose.conn;

  if (!globalCache.mongoose?.promise) {
    globalCache.mongoose.promise = mongoose.connect(MONGODB_URI, {
      dbName: "kennel-management",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }) as Promise<Connection>;
  }

  globalCache.mongoose.conn = await globalCache.mongoose.promise;
  return globalCache.mongoose.conn;
}
