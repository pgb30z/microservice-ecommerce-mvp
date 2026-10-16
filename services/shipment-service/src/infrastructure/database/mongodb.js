import "dotenv/config";
import mongoose from "mongoose";

export async function connectMongoDB() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI ||
        "mongodb://localhost:27017/shipment_db"
    );

    console.log(
      "Shipment MongoDB connected"
    );
  } catch (error) {
    console.error(
      "Shipment MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
}