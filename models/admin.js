import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String }, // empty for google-only admins
    name: String,
    img: String,
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);
