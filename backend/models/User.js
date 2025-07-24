import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  publicKey: String, 
  newLogin: { type: Boolean, default: false },
  newSession: { type: String, default: '' }
});

const User = mongoose.model("User", userSchema);
export default User;