import dotenv from "dotenv";
import app from './app.js';
import { connectDb } from './db/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
if (!process.env.JWT_SECRET) console.log('Warning: JWT_SECRET is not set. Admin login will fail.');

app.listen(PORT, () => {
    connectDb();
    console.log(`Server is running at http://localhost:${PORT}`);
});