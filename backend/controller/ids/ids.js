import mongoose from "mongoose";
import userModel from "../../models/user/user.js";
import adminModel from "../../models/admin/admin.js";
import estateModel from "../../models/estate/estate.js";
import { HouseModel } from "../../models/house/house.js";
import spectModel from "../../models/spect/spect.js";
import IdsModel from "../../models/ids.js";

class IdController {
  async getTotal(req, res, next) {
    const user_Page = await userModel.countDocuments({});
    const admin_Page = await adminModel.countDocuments({});
    const estate_page = await estateModel.countDocuments({});
    const house_page = await HouseModel.countDocuments({});
    const spect_page = await spectModel.countDocuments({});
    // console.log(user_Page);
    res.send({
      status: 1,
      user_Page,
      admin_Page,
      estate_page,
      house_page,
      spect_page,
    });
  }
}

export default new IdController();
