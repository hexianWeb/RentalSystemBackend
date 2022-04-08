import mongoose from "mongoose";

import moment from "moment";

import { houseSchema } from "../house/house.js";

const Schema = mongoose.Schema;

const estateSchema = new Schema({
  estate_id: { type: String, required: true },
  estate_title: { type: String, required: true },
  province: { type: String, required: true },
  city: { type: String, required: true },
  area: { type: String, required: true },
  address: { type: String, required: true },
  //   涵盖房屋有
  house: [houseSchema],
  map_lng: { type: Number },
  map_lat: { type: Number },
  created: { type: String, default: moment().format("L") },
  updated: { type: String, default: "" },
});
estateSchema.index({ estate_id: 1 });

const Estate = mongoose.model("Estate", estateSchema);

export default Estate;
