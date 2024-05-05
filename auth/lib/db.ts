import { secret } from "encore.dev/config";
import { connectDB } from "../../database";

const DB_URI = secret('DB_URI');

export const db = await connectDB(DB_URI());