import User from "../models/userModel";

export async function ensureSeeded(): Promise<void> {
  const count = await User.countDocuments();
  if (count > 0) return;

  await User.insertMany([
    { name: "Alice Martin", email: "alice@example.com", role: "admin", createdAt: new Date("2024-01-15") },
    { name: "Bob Dupont", email: "bob@example.com", role: "user", createdAt: new Date("2024-02-20") },
    { name: "Clara Lemoine", email: "clara@example.com", role: "user", createdAt: new Date("2024-03-10") },
  ]);
}

