import dotenv from "dotenv";
import app from "./app.js";
import { connectDb } from "./db/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
    console.warn("Warning: JWT_SECRET is not set. Admin login may fail.");
}

const startServer = async () => {
    try {
        await connectDb();

        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
