import mongoose from "mongoose";

const Schema = mongoose.Schema;

const emailSchema = new Schema({
  email: { type: String, required: true },
  vire: { type: Number, required: true },
});

const Email = mongoose.model("Email", emailSchema);

export default Email;
