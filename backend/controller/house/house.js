import mongoose from "mongoose";

import moment from "moment";

import { HouseModel } from "../../models/house/house.js";

import EstateModel from "../../models/estate/estate.js";
import Baseproto from "../../prototype/baseproto.js";

import chalk from "chalk";
import formidable from "formidable";

class House extends Baseproto {
  constructor() {
    super();
    this.pushHouse = this.pushHouse.bind(this);
  }
  // 楼盘ID在req中传递
  async pushHouse(req, res, next) {}
}

export default new House();
