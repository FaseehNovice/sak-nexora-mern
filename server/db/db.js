import mongoose from "mongoose";

export const connectDb = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not configured");
    }

    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB connected: ${conn.connection.host}`);

    return conn.connection;
};
