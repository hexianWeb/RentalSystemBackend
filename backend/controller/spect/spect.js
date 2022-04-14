import Baseproto from "../../prototype/baseproto.js";

import UserModel from "../../models/user/user.js";

import SpectModel from "../../models/spect/spect.js";

import { HouseModel } from "../../models/house/house.js";
import moment from "moment";
class Spect extends Baseproto {
  constructor() {
    super();
    this.addSpect = this.addSpect.bind(this);
  }
  //   用户端创建订单
  async addSpect(req, res, next) {
    const { user_id, house_id, seeTime } = req.body;
    const house_status = await HouseModel.findOne({ house_id }, "-_id status");
    // 验证信息 出租的房屋不可再次出租
    try {
      if (!user_id || !house_id || !seeTime) {
        throw new Error("信息不完整");
      } else if (house_status.status != 0) {
        throw new Error("房屋已出租");
      }
    } catch (error) {
      res.cc(error.message);
      return;
    }
    // 获取订单ID
    let spect_id;
    try {
      spect_id = await this.getId("spect_id");
    } catch (error) {
      res.cc("获取订单ID失败");
      return;
    }

    // 填入订单信息
    try {
      const { realname, user_phone } = await UserModel.findOne(
        { user_id },
        "realname user_phone"
      );
      if (!realname) {
        res.cc("未实名认证");
        return;
      } else if (!user_phone) {
        res.cc("未填写手机号");
        return;
      }
      const newSpect = {
        spect_id,
        house_id,
        user_id,
        seeTime,
        user_realName: realname,
        user_phone,
      };

      //   创建订单 修改房源出租状态
      await SpectModel.create(newSpect);
      await HouseModel.updateOne(
        { house_id },
        { $set: { status: 1, updated: moment().format("LL") } }
      );
      res.send({ status: 1, msg: "成功创建订单" });
    } catch (error) {
      res.cc(error.message);
      return;
    }
  }

  //   获取全部订单
  async getAllSpect(req, res, next) {
    const { limit = 5, offset = 0 } = req.query;
    try {
      const allSpect = await SpectModel.find({})
        .sort({ spect_id: 1 })
        .skip(Number(offset))
        .limit(Number(limit));
      res.send({
        status: 1,
        data: allSpect,
      });
    } catch (error) {
      res.cc(error.message);
    }
  }

  //   管理员根据订单号确认
  async confirmSpect(req, res, next) {
    const spect_id = req.query.spect_id;
    if (!spect_id) {
      res.cc("订单号不存在");
      return;
    }
    try {
      await SpectModel.updateOne({ spect_id }, { $set: { status: 1 } });
      res.send({
        status: 0,
        message: "订单状态已改变",
      });
    } catch (error) {
      res.cc(error.message);
    }
  }

  // 用户取消订单
  async deleteSpect(req, res, next) {
    const spect_id = req.query.spect_id;
    const user_id = req.session.user_id;

    try {
      const spectDoc = await SpectModel.find(
        { spect_id },
        "-_id user_id house_id"
      );
      //   不能删除他人订单
      if (spectDoc.user_id == user_id) {
        await SpectModel.deleteOne({ spect_id });
        await HouseModel.updateOne(
          { house_id: spectDoc.house_id },
          {
            $set: { status: 0, updated: moment().format("LL") },
          }
        );
        res.send({
          status: 1,
          msg: "删除订单成功",
        });
      }
    } catch (error) {
      res.cc(error.message);
      return;
    }
  }
}

export default new Spect();
