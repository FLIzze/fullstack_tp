import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDB connecté : ${conn.connection.host}`);
  } catch (err) {
    console.error("Erreur connexion MongoDB :", err);
    process.exit(1);
  }
}

