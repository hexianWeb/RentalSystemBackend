import EstateModel from "../../models/estate/estate.js";

import Baseproto from "../../prototype/baseproto.js";

import chalk from "chalk";

import moment from "moment";

class Estate extends Baseproto {
  constructor() {
    super();
    this.addEstate = this.addEstate.bind(this);
  }
  async addEstate(req, res, next) {
    // console.log(req.body);
    var { estate_title, province, city, area, address, map_lng, map_lat } =
      req.body;
    try {
      const estate_id = await this.getId("estate_id");
      if (EstateModel.findOne({ estate_title })) {
        res.cc("已经存在相同的地区");
        return;
      }
      const newEstate = {
        estate_id,
        estate_title,
        province,
        city,
        area,
        address,
        map_lng,
        map_lat,
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
        "-_id -estate_id -map_lng -map_lat"
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
      res, cc("获取房产列表失败");
    }
  }
  async deleteById(req, res, next) {
    const id = req.params.estate_id;
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
            status: 0,
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
    // console.log(req.body);
    var {
      estate_id,
      estate_title,
      province,
      city,
      area,
      address,
      map_lng,
      map_lat,
    } = req.body;
    try {
      const estate = await EstateModel.findOne({ estate_title });
      if (estate) {
        res.cc("相同地区房产已经存在");
        return;
      }
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
}

export default new Estate();
