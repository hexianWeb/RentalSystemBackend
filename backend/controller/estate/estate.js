import EstateModel from "../../models/estate/estate.js";

import Baseproto from "../../prototype/baseproto.js";

// 地址转换为坐标
import { getLocation } from "../../util/map/getLocation.js";
import Qs from "qs";
// 解析post数组

import chalk from "chalk";

import moment from "moment";

class Estate extends Baseproto {
  constructor() {
    super();
    this.addEstate = this.addEstate.bind(this);
  }
  async addEstate(req, res, next) {
    const { estate_title, province, city, area, address, tmp, desc } = req.body;

    const { type } = Qs.parse(tmp);
    // console.log(type);
    try {
      const estate_id = await this.getId("estate_id");
      const flag = await EstateModel.findOne({ estate_title });
      if (flag) {
        res.cc("已经存在相同的地区");
        return;
      }
      // 地址拼接
      const better_address = province + city + area + address;
      // 坐标获取
      let { map_lat, map_lng } = await getLocation(better_address);
      // return;
      const newEstate = {
        estate_id,
        estate_title,
        province,
        city,
        area,
        address,
        map_lng,
        map_lat,
        desc,
        type,
      };
      await EstateModel.create(newEstate);

      res.send({
        status: 1,
        msg: "成功添加房产",
      });
    } catch (error) {
      console.log(chalk.red("添加房产失败" + error.message));
      res.cc("添加失败");
    }
  }
  async getAllEstate(req, res, next) {
    const { limit = 10, offset = 0 } = req.query;
    try {
      const allEstate = await EstateModel.find(
        {},
        "-_id  -map_lng -map_lat -house -updated -created"
      )
        .sort({ estate_id: 1 })
        .skip(Number(offset))
        .limit(Number(limit));
      res.send({
        status: 1,
        data: allEstate,
      });
    } catch (error) {
      console.log(chalk.red("获取房产列表失败", error.message));
      res.cc("获取房产列表失败");
    }
  }
  async deleteById(req, res, next) {
    const id = req.params.estate_id;
    console.log(chalk.red(id));
    if (!id || !Number(id)) {
      console.log(chalk.red("estate_id参数错误"));
      res.cc({
        status: 0,
        message: "estate_id参数错误",
      });
      return;
    }
    try {
      // FIXME:无法使用await进行异步操作
      EstateModel.findOneAndDelete(
        {
          estate_id: id,
        },
        function (err, docs) {
          if (err) {
            throw new Error("出错了 删除地区失败");
          }
          res.send({
            status: 1,
            data: docs,
          });
        }
      );
    } catch (error) {
      console.log("删除地区失败", error.message);
      res.send({
        status: 0,
        msg: "删除地区失败",
      });
    }
  }
  async updateEstate(req, res, next) {
    const {
      estate_id,
      estate_title,
      province,
      city,
      area,
      address,
      tmp,
      desc,
    } = req.body;

    const { type } = Qs.parse(tmp);
    try {
      const better_address = province + city + area + address;
      let { map_lat, map_lng } = await getLocation(better_address);
      await EstateModel.findOneAndUpdate(
        { estate_id: estate_id },
        {
          $set: {
            estate_title,
            province,
            city,
            area,
            address,
            map_lng,
            map_lat,
            updated: moment().format("L"),
            desc,
            type,
          },
        }
      );

      res.send({
        status: 1,
        msg: "成功更新房产",
      });
    } catch (error) {
      res.cc("更新失败");
    }
  }
  async searchEstate(req, res, next) {
    const regexp = new RegExp(req.query.searchV, "i");

    EstateModel.find(
      {
        $or: [
          { estate_id: { $regex: regexp } },
          { estate_title: { $regex: regexp } },
          { province: { $regex: regexp } },
          { city: { $regex: regexp } },
          { area: { $regex: regexp } },
        ],
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          res.cc("查询失败");
        }
        if (doc) {
          res.send({
            state: 1,
            msg: "查询成功",
            data: doc,
          });
        }
      }
    );
  }
}

export default new Estate();
