import mongoose, { InferSchemaType } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export type UserDoc = InferSchemaType<typeof userSchema> & { _id: mongoose.Types.ObjectId };

const User = mongoose.model("User", userSchema);
export default User;
