import mongoose from "mongoose";
import { config } from "../config/config";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodb.uri);
    console.log("MongoDB connected:", conn.connection.host);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};
