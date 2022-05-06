import mongoose from "mongoose";

import moment from "moment";

const Schema = mongoose.Schema;

const spectSchema = new Schema({
  spect_id: { type: Number, required: true },
  house_id: {
    type: Number,
    required: true,
  },
  user_id: {
    type: Number,
    required: true,
  },
  // 0 待确认 1待看房 2已取消 3已完成
  status: {
    type: Number,
    default: 0,
    // required: true,
  },
  seeTime: {
    type: String,
    default: moment().format("L"),
    required: true,
  },
  money: {
    type: Number,
    required: true,
  },
  created: {
    type: String,
    default: moment().format("L"),
  },
  user_realName: {
    type: String,
    required: true,
  },
  user_phone: {
    type: String,
    required: true,
  },
});

spectSchema.index({ spect_id: 1 });

const spect = mongoose.model("Spect", spectSchema);

export default spect;
