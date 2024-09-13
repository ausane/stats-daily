import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  image: { type: String },
});

export const User = models.User || model("User", userSchema);
