import mongoose from "mongoose";

import moment from "moment";

import { HouseModel } from "../../models/house/house.js";

import EstateModel from "../../models/estate/estate.js";
import Baseproto from "../../prototype/baseproto.js";

import Qs from "qs";
// 绝对路径
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import chalk from "chalk";

import path from "path";

import fs from "fs";
import formidable from "formidable";
import { cutPic } from "../../util/cut_pic.js";

class House extends Baseproto {
  constructor() {
    super();
    this.pushHouse = this.pushHouse.bind(this);
    this.pushHouse2 = this.pushHouse2.bind(this);
    this.updateLoadImg = this.updateLoadImg.bind(this);
  }
  // 楼盘ID在req中传递 弃用
  async pushHouse(req, res, next) {
    const estate_id = req.query.estate_id;
    const {
      title,
      rent,
      tmp,
      useArea,
      floor,
      orientataion,
      pic,
      rentMethod,
      paymentMethod,
    } = req.body;
    console.log(req.body);
    // 解析type
    const { type } = Qs.parse(tmp);
    console.log(type);
    try {
      const house = await HouseModel.findOne({ title });
      if (house) {
        res.cc("请勿重复添加房屋");
      } else {
        // 生成ID
        const house_id = await this.getId("house_id");
        const newHouse = {
          house_id,
          title,
          rent,
          housetype: type,
          useArea,
          floor,
          orientataion,
          pic,
          rentMethod,
          paymentMethod,
        };
        console.log(chalk.yellow(newHouse));
        const Subdoc = await HouseModel.create(newHouse);
        await EstateModel.updateOne(
          { estate_id },
          {
            $push: { house: Subdoc },
            function(err, docs) {
              if (err) {
                console.log(err);
              }
              console.log(docs);
            },
          }
        );
        res.send({
          status: 0,
          message: "房屋添加成功",
        });
      }
    } catch (error) {
      console.log(chalk.red("房屋添加失败", error.message));
      res.cc("房屋添加失败");
    }
  }

  async getAllHouseByEstate_id(req, res, next) {
    const { limit = 5, offset = 0, estate_id } = req.query;
    try {
      const allHouse = await EstateModel.find({ estate_id }, "house -_id")
        .sort({ house_id: 1 })
        .skip(Number(offset))
        .limit(Number(limit));
      res.send({
        status: 1,
        data: allHouse,
      });
    } catch (error) {
      console.log(chalk.red("获取房屋列表失败", error.message));
      res.cc("eRROR");
    }
  }

  async pushHouse2(req, res, next) {
    const estate_id = req.query.estate_id;
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      console.dir(chalk.blueBright(JSON.stringify(fields)));
      console.log(files);
      // 获取信息部分
      var {
        title,
        rent,
        rentMethod,
        paymentMethod,
        housetype,
        useArea,
        floor,
        orientataion,
      } = fields;

      let img_id;
      try {
        img_id = await this.getId("img_id");
      } catch (error) {
        fs.unlinkSync(files.file.filepath);
        res.cc("获取图片ID失败");
        return;
      }
      const newImgName = moment().format().toString() + img_id;
      const extname = path.extname(files.file.originalFilename);
      if (![".jpg", ".jpeg", ".png"].includes(extname)) {
        fs.unlinkSync(files.file.filepath);
        res.cc("文件格式错误");
        return;
      }
      const pic = newImgName + extname;
      const repath = path.join(__dirname, "../../public/img", pic);
      try {
        fs.renameSync(files.file.filepath, repath);
        cutPic(repath, 600);
      } catch (error) {
        if (fs.existsSync(repath)) {
          fs.unlinkSync(repath);
        } else {
          fs.unlinkSync(files.file.filepath);
        }
        return res.cc("保存图片失败");
      }
      let house_id;
      try {
        house_id = await this.getId("house_id");
      } catch (error) {
        res.cc("房屋ID获取失败");
      }
      const newHouse = {
        house_id,
        title,
        rent,
        housetype,
        useArea,
        floor,
        orientataion,
        pic,
      };
      const Subdoc = await HouseModel.create(newHouse);
      await EstateModel.updateOne(
        { estate_id },
        {
          $push: { house: Subdoc },
          function(err, docs) {
            if (err) {
              console.log(err);
            }
          },
        }
      );
      res.send({
        status: 0,
        message: "房屋添加成功",
      });
    });
  }

  async getHouseInfoByHouse_id(req, res, next) {
    const house_id = req.query.house_id;
    try {
      const house = await HouseModel.find({ house_id });
      res.send({
        status: 1,
        data: house,
      });
    } catch (error) {
      res.cc("Error");
    }
  }

  // 删除房源信息 (主子文档)
  async deleteHouseInfoByHouse_id(req, res, next) {
    const estate_id = req.query.estate_id;
    const house_id = req.query.house_id;
    // DONE:删除子文档
    try {
      const Subdoc = await HouseModel.findOne({ house_id });
      if (!Subdoc) {
        res.cc("不存在该房屋");
        return;
      } else {
        await EstateModel.updateOne(
          { estate_id },
          {
            $pull: { house: { house_id } },
          }
        );
        await Subdoc.remove();
        res.send({
          status: 0,
          message: "删除成功",
        });
      }
    } catch (error) {
      res.cc("房屋删除失败", error.message);
    }
    // // DONE:删除主文档
    // try {
    //   await HouseModel.deleteOne({ house_id });
    //   res.send({
    //     status: 1,
    //     msg: "房屋删除成功",
    //   });
    // } catch (error) {
    //   res.cc("删除失败");
    // }
  }

  // 更新房源信息（删除后新增）

  // 获取房屋信息从子文档
  async getHouseInfo(req, res, next) {
    // 修改为只显示运营管理人员旗下的作品
    const { limit = 10, offset = 0 } = req.query;
    try {
      const allHouse = await HouseModel.find({}, "-id -updated")
        .sort({ house_id: 1 })
        .skip(Number(offset))
        .limit(Number(limit));
      res.send({
        status: 1,
        data: allHouse,
      });
    } catch (error) {
      res.cc("获取房屋列表失败");
    }
  }

  // 上传房屋图片
  async updateLoadImg(req, res, next) {
    await this.uploadImg(req, res);
  }
}

export default new House();
