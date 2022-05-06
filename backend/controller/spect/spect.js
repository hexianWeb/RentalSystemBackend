import Baseproto from "../../prototype/baseproto.js";

import UserModel from "../../models/user/user.js";

import SpectModel from "../../models/spect/spect.js";

import { HouseModel } from "../../models/house/house.js";

import Email from "../../controller/email/email.js";

import moment from "moment";

class Spect extends Baseproto {
  constructor() {
    super();
    this.addSpect = this.addSpect.bind(this);
  }
  //   用户端创建订单
  async addSpect(req, res, next) {
    const { user_id, house_id, seeTime } = req.body;
    const house = await HouseModel.findOne({ house_id }, "-_id status rent");
    // console.log(house.rent);
    // 验证信息 出租的房屋不可再次出租
    try {
      if (!user_id || !house_id || !seeTime) {
        throw new Error("信息不完整");
      } else if (house.status != 0) {
        throw new Error("房屋已被占用");
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
        money: house.rent,
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
      let spectDoc = await SpectModel.findOne({ spect_id }, "house_id");
      console.log(spectDoc);
      if (!spectDoc) {
        res.cc("订单号不存在");
        return;
      } else {
        // 更改订单为待看房状态
        await SpectModel.updateOne({ spect_id }, { $set: { status: 1 } });
        res.send({
          status: 1,
          message: "订单状态已改变，用户允许看房",
        });
      }
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
        // await SpectModel.deleteOne({ spect_id });
        // 交易失败 订单不会消失 进入状态3 交易失败
        await SpectModel.updateOne({ spect_id }, { $set: { status: 3 } });
        // 房源状态恢复上架的状态0
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

  // 用户确定订单
  async getHouse(req, res, next) {
    const spect_id = parseInt(req.query.spect_id);
    const spectDoc = await SpectModel.findOne({ spect_id }, "house_id user_id");
    // 更新房源状态以及订单状态
    await HouseModel.updateOne(
      { house_id: spectDoc.house_id },
      { $set: { status: 2 } }
    );
    await SpectModel.updateOne({ spect_id }, { $set: { status: 2 } });
    // TODO:异步发送邮件
    // 找到用户对应邮箱
    let userDoc = await UserModel.findOne(
      { user_id: spectDoc.user_id },
      "user_email"
    );
    console.log(userDoc.user_email);
    Email.emailForHouse(userDoc.user_email);
    res.send({ status: 1, message: "租房完成" });
  }

  // 获取本日月订单数量
  async newSpectNumber(req, res, next) {
    let today = moment().format("L");
    let month = moment().format("MM");
    const reg = new RegExp(month);
    // 查询每天与每月新增数目
    const todayNumber = await SpectModel.countDocuments({ created: today });
    const mouthNumber = await SpectModel.countDocuments({
      created: { $regex: reg },
    });
    res.send({
      status: 1,
      data: {
        todayNumber,
        mouthNumber,
      },
    });
  }

  // 获取订单金额统计
  async newSpectMoney(req, res, next) {
    let today = moment().format("L");
    let month = moment().format("MM");
    const reg = new RegExp(month);
    // 查询每天与每月新增数目
    // FIXME: 匹配不严禁 垃圾
    const todayNumber = await SpectModel.aggregate([
      { $group: { _id: "$created", money: { $sum: "$money" } } },
      { $match: { _id: today } },
    ]);
    const mouthNumber = await SpectModel.aggregate([
      {
        $group: { _id: "$created", money: { $sum: "$money" } },
      },
      { $match: { _id: { $regex: reg } } },
    ]);
    // console.log(mouthNumber);
    var num = 0;
    mouthNumber.forEach((i) => {
      num += i.money;
    });
    res.send({
      status: 1,
      data: {
        todayNumber: todayNumber.money ? todayNumber.money : 0,
        mouthNumber: num,
      },
    });
  }

  // 每月金额数据统计
  async EchartMoney(req, res, next) {
    let month = moment().format("MM");
    const reg = new RegExp(month);

    const mouthData = await SpectModel.aggregate([
      {
        $group: {
          _id: "$created",
          money: { $sum: "$money" },
        },
        // $sort: { _id: 1 },
      },
      { $sort: { _id: 1 } },
    ]);
    res.send({
      status: 1,
      mouthData,
    });
  }
}

export default new Spect();
