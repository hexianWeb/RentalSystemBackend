import mongoose from "mongoose";

import moment from "moment";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  user_id: { type: Number, required: true },
  user_name: { type: String, required: true },
  sex: { type: String, default: "" }, // 0-man 1-woman
  user_password: { type: String, required: true },
  user_phone: { type: String, required: true },
  user_email: { type: String, required: true },
  authStatus: { type: Number, default: 0 }, // 0-未实名 1-审核 2-实名
  add_time: { type: String, default: moment().format("L") },
  realname: { type: String, default: "" },
  IdNum: { type: String, default: "" }, //default null
  avatar: { type: String, default: "default.jpg" },
});

userSchema.index({ user_id: 1 });

const User = mongoose.model("User", userSchema);

export default User;
