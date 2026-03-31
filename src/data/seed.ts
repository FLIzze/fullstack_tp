import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db";
import User from "../models/userModel";

async function seed(): Promise<void> {
  await connectDB();

  const count = await User.countDocuments();
  if (count > 0) {
    console.log(`Seed ignoré: collection déjà remplie (${count} documents)`);
    await mongoose.connection.close();
    return;
  }

  await User.insertMany([
    { name: "Alice Martin", email: "alice@example.com", role: "admin", createdAt: new Date("2024-01-15") },
    { name: "Bob Dupont", email: "bob@example.com", role: "user", createdAt: new Date("2024-02-20") },
    { name: "Clara Lemoine", email: "clara@example.com", role: "user", createdAt: new Date("2024-03-10") },
  ]);

  console.log("Seed terminé: 3 utilisateurs insérés");
  await mongoose.connection.close();
}

seed().catch(async (err) => {
  console.error("Erreur seed :", err);
  try {
    await mongoose.connection.close();
  } catch {
    // ignore
  }
  process.exit(1);
});

