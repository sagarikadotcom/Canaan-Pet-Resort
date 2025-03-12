import dotenv from "dotenv";
dotenv.config(); // Load environment variables

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI
async function testConnection() {
  try {
    if (!MONGODB_URI) throw new Error("MONGODB_URI is missing!");

    await mongoose.connect(MONGODB_URI, {
      dbName: "kennel-management",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected Successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
}

testConnection();
