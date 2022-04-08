import UserModel from "../../models/user/user.js";

import Baseproto from "../../prototype/baseproto.js";

import chalk from "chalk";

import bcrpt from "bcryptjs";
import formidable from "formidable";
import { errorLogger } from "express-winston";

class User extends Baseproto {
  constructor() {
    super();
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.updateAvatar = this.updateAvatar.bind(this);
  }

  async login(req, res, next) {
    const { user_name, user_password } = req.body;
    try {
      if (!user_name || !user_password) {
        throw new Error("用户名密码参数空缺");
      }
    } catch (error) {
      res.cc(error.message);
      return;
    }
    // 密码验证
    try {
      const user = await UserModel.findOne({ user_name });
      if (!user) {
        console.log(chalk.yellow("账户不存在"));
        res.cc("账户错误");
      } else if (!bcrpt.compareSync(user_password, user.user_password)) {
        console.log(chalk.yellow("密码错误"));
        res.cc("密码错误");
      } else {
        req.session.user_id = user.user_id;
        res.send({
          status: 0,
          success: "登录成功",
        });
      }
    } catch (error) {
      console.log(chalk.red("登录管理员失败") + error.message);
      res.cc("登录管理员失败");
    }
  }

  async register(req, res, next) {
    var { user_name, user_password, email, user_phone } = req.body;
    try {
      if (!user_name || !user_password) {
        throw new Error("信息不完整");
      }
    } catch (error) {
      res.cc(error.message);
      return;
    }
    // 是否已经存在
    try {
      const user = await UserModel.findOne({ user_name });
      if (user) {
        res.cc("该用户已经存在");
      } else {
        // 获取自增id
        const user_id = await this.getId("user_id");

        //   密码加密
        user_password = await bcrpt.hashSync(user_password, 10);
        const newUser = {
          user_id,
          user_name,
          user_password,
          user_phone,
          user_email: email,
        };
        // 创建实例对象
        await UserModel.create(newUser);
        res.send({
          status: 1,
          msg: "注册成功",
        });
      }
    } catch (error) {
      console.log(chalk.red("注册失败" + error.message));
      res.cc("注册失败");
    }
  }

  async singout(req, res, next) {
    try {
      delete req.session.user_id;
      res.send({
        status: 0,
        success: "退出成功",
      });
    } catch (error) {
      console.log(chalk.red("退出失败") + error.message);
      res.cc("退出失败");
    }
  }

  async updateAvatar(req, res, next) {
    const user_id = req.params.user_id;
    if (!user_id || !Number(user_id)) {
      console.log(chalk.red("user_id参数不存在", user_id));
      res.cc("user_id为空");
      return;
    }
    try {
      const img_path = await this.getPath(req, res);
      console.dir(img_path);
      // 更新Admin头像
      await UserModel.findOneAndUpdate(
        { user_id: user_id },
        { $set: { avatar: img_path } }
      );
      res.send({
        status: 1,
        img_path,
      });
      return;
    } catch (error) {
      console.log(chalk.red("上传图片失败" + error.message));
      res.cc("上传图片失败");
    }
    return;
  }

  async getUserInfo(req, res, next) {
    const user_id = req.session.user_id;
    if (!user_id || !Number(user_id)) {
      res.cc("获取用户信息失败");
      return;
    }
    try {
      const info = await UserModel.findOne(
        { user_id: user_id },
        "user_id user_name sex user_phone user_email authStatus add_time realname avatar IdNum"
      );
      if (!info) {
        throw new Error("未找到当前用户信息");
      }
      res.send({
        status: 1,
        data: info,
      });
    } catch (error) {
      res.cc(error.message);
    }
  }

  async updateInfo(req, res, next) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log(chalk.red("获取用户信息from出错", err.message));
        res.cc("表单信息错误");
        return;
      }
      const { user_id, user_name, user_phone, user_email } = fields;
      try {
        if (!user_name) {
          throw new Error("用户名更新错误");
        } else if (!user_phone) {
          throw new Error("用户电话更新错误");
        }
        const user = await UserModel.findOne({ user_name });
        if (user) {
          res.cc("已经存在");
        } else {
          await UserModel.findOneAndUpdate(
            { user_id: user_id },
            {
              $set: {
                user_name,
                user_phone,
                user_email,
              },
            }
          );
          res.send({
            status: 1,
            msg: "更新成功",
          });
        }
      } catch (error) {
        console.log(chalk.red("信息更新失败", +error));
        res.cc("更新失败");
      }
    });
  }

  async getAllUser(req, res, next) {
    const { limit = 10, offset = 0 } = req.query;
    try {
      const allUser = await UserModel.find(
        {},
        "-_id -user_password -IdNum -__v"
      )
        .sort({ user_id: 1 })
        .skip(Number(offset))
        .limit(Number(limit));
      res.send({
        status: 1,
        data: allUser,
      });
    } catch (error) {
      console.log(chalk.red("获取用户列表失败", error.message));
      res.cc("获取用户列表失败");
    }
  }
}

// 暴露路由
export default new User();
