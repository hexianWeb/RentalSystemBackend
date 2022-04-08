import mongoose from "mongoose";

const Schema = mongoose.Schema;

const adminSchema = new Schema({
  user_id: { type: Number, required: true },
  user_name: { type: String, required: true },
  user_password: { type: String, required: true },
  user_phone: { type: Number, default: "12160018" },
  avatar: { type: String, default: "default.jpg" },
  user_level: { type: Number, default: 1 },
});

adminSchema.index({ user_id: 1 });
const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
