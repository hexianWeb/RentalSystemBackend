import Ids from "../models/ids.js";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import moment from "moment";
// import gm from "gm";
import { cutPic } from "../util/cut_pic.js";
// 一个强大的文件解析工具
import formidable from "formidable";
// // ES6无法使用__dirname等
// import { fileURLToPath } from "url";
// import { dirname } from "path";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// 七牛云上传服务
// import qiniu from "qiniu";
// import { rejects } from "assert";
// var accessKey = "PCBhmFshQilBkRGzDCL73Zchml0b0-nJPVAL5qKR";
// var secretKey = "eE8L0H5Z2czTnR9MelcOUv_qrSIY5leElnH-7KSo";
// var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

export default class Baseproto {
  constructor() {
    this.idList = [
      "user_id",
      "admin_id",
      "img_id",
      "estate_id",
      "house_id",
      "spect_id",
    ];
    this.imgTypeList = ["avatar"];
    this.uploadImg = this.uploadImg.bind(this);
  }
  //   获取id 完善自增
  async getId(type) {
    if (!this.idList.includes(type)) {
      console.log(chalk.red("id类型错误"));
      throw new Error("id类型错误");
    }
    try {
      const idData = await Ids.findOne();
      idData[type]++;
      await idData.save();
      return idData[type];
    } catch (error) {
      console.log(chalk.red("获取ID失败"));
      throw new Error(error);
    }
  }

  async uploadImg(req, res, next) {
    try {
      const image_path = await this.getPath(req, res);
      res.send({
        statu: 1,
        image_path,
      });
    } catch (error) {
      console.log(chalk.red("图片上传失败", err));
      res.cc("图片上传失败");
    }
  }
  // 上传本机;
  async getPath(req, res) {
    return new Promise((resolve, reject) => {
      // 创建 incoming form实例
      const form = new formidable.IncomingForm();
      // 不允许多文科上传本机
      form.multiples = false;
      form.encoding = "utf-8";
      // // 不保留表单文件的扩展名
      form.keepExtensions = false;
      // 存放临时图片的二进制文件
      form.uploadDir = path.join("./tmp");
      /* fields 是字段 files是文件  */
      // TODO:请更新为多文件上传
      form.parse(req, async (err, fields, files) => {
        console.log(files);
        if (err) {
          console.log(chalk.red("上传图片出错了" + err.message));
          reject("上传出错");
        }
        let img_id;
        try {
          img_id = await this.getId("img_id");
        } catch (error) {
          console.log(chalk.red("获取imgID失败" + error.message));
          fs.unlinkSync(files.file.filepath);
          reject("获取图片ID失败");
          return;
        }
        // 重命名图片
        // TODO:迭代为可以指定类型的图片上传方式
        const newImgName = moment().format().toString().trim() + img_id;
        const extname = path.extname(files.file.originalFilename);
        // 类型判断
        if (![".jpg", ".jpeg", ".png"].includes(extname)) {
          fs.unlinkSync(files.file.filepath);
          res.cc("文件格式错误");
          reject("上传失败");
          return;
        }
        const fullName = newImgName + extname;
        const repath = path.join("./public/img", fullName);
        try {
          fs.renameSync(files.file.filepath, repath);
          // 使用封装好的工具类切割图片
          cutPic(repath, 200);
          // 返回fullName
          resolve(fullName);
        } catch (err) {
          console.log("保存图片失败", err);
          if (fs.existsSync(repath)) {
            fs.unlinkSync(repath);
          } else {
            fs.unlinkSync(files.file.filepath);
          }
          reject("保存图片失败");
        }
      });
    });
  } // 上传本机;（弃用）
  async getHouseForm(req, res) {
    return new Promise((resolve, reject) => {
      // 创建 incoming form实例
      const form = new formidable.IncomingForm();
      // 不允许多文科上传本机
      form.multiples = false;
      form.encoding = "utf-8";
      // // 不保留表单文件的扩展名
      form.keepExtensions = false;
      // 存放临时图片的二进制文件
      form.uploadDir = path.join("../tmp");
      /* fields 是字段 files是文件  */
      // TODO:请更新为多文件上传
      form.parse(req, async (err, fields, files) => {
        console.dir(chalk.blueBright(JSON.stringify(fields)));
        if (err) {
          console.log(chalk.red("上传图片出错了" + err.message));
          reject("上传出错");
        }
        let img_id;
        try {
          img_id = await this.getId("img_id");
        } catch (error) {
          console.log(chalk.red("获取imgID失败" + error.message));
          fs.unlinkSync(files.file.filepath);
          reject("获取图片ID失败");
          return;
        }
        // 重命名图片
        // TODO:迭代为可以指定类型的图片上传方式
        const newImgName = moment().format().toString().trim() + img_id;
        const extname = path.extname(files.file.originalFilename);
        if (![".jpg", ".jpeg", ".png"].includes(extname)) {
          fs.unlinkSync(files.file.filepath);
          res.cc("文件格式错误");
          reject("上传失败");
          return;
        }
        const fullName = newImgName + extname;
        // const repath = "./public/img/" + fullName;
        const repath = path.join("./public/img", fullName);
        try {
          fs.renameSync(files.file.filepath, repath);
          // 使用封装好的工具类切割图片
          cutPic(repath, 200);
          // 返回fullName
          resolve(fullName);
        } catch (err) {
          console.log("保存图片失败", err);
          if (fs.existsSync(repath)) {
            fs.unlinkSync(repath);
          } else {
            fs.unlinkSync(files.file.filepath);
          }
          reject("保存图片失败");
        }
      });
    });
  }

  isFileValid = (file) => {
    const type = file.type.split("/").pop();
    console.log(type);
    const vaildTypes = ["jpg", "jpeg", "png"];
    if (validTypes.indexOf(type) === -1) {
      return false;
    }
    return true;
  };
}
