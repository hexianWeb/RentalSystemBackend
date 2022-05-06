import mongoose from "mongoose";

import moment from "moment";

const Schema = mongoose.Schema;

const houseSchema = new Schema({
  // 房源ID  无需
  house_id: { type: Number, required: true },
  title: { type: String, required: true },
  //   无需
  //   estateId: { type: String, required: true },
  rent: { type: Number, required: true },
  //   租赁 方式 1-整租 2-合租 3-短租
  rentMethod: { type: String, default: "整租" },
  //租房手段
  paymentMethod: { type: String, default: "押一付一" },
  housetype: [{ type: String, default: "" }],
  useArea: { type: String, default: "" },
  //   0低 1中 2高
  floor: { type: String, required: true },
  orientataion: { type: String, required: true },
  pic: { type: String, default: "default_home.jpg" },
  // admin_id: { type: Number, required: true },
  status: { type: Number, default: 0, required: true },
  created: { type: String, trim: true, default: moment().format("L") },
  updated: { type: String, default: "" },
});

houseSchema.index({ house_id: 1 });

const house = mongoose.model("House", houseSchema);

// export default house;

export { houseSchema, house as HouseModel };
