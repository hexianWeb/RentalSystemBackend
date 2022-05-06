import AdminModel from "../../models/admin/admin.js";

import Baseproto from "../../prototype/baseproto.js";

import chalk from "chalk";
// 引入密码加密中间件
import bcrypt from "bcryptjs";

class Admin extends Baseproto {
  constructor() {
    super();
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    // this.encryption = this.encryption.bind(this);
    this.updateAvatar = this.updateAvatar.bind(this);
  }
  async login(req, res, next) {
    // 对象结构 获取数据
    const { user_name, user_password, status = 1 } = req.body;
    // 后端数据验证
    try {
      if (!user_name) {
        throw new Error("用户名参数错误");
      } else if (!user_password) {
        throw new Error("密码参数错误");
      }
    } catch (error) {
      res.cc(error.message);
      return;
    }
    try {
      const admin = await AdminModel.findOne({ user_name });
      if (!admin) {
        console.log(chalk.yellow("该账户不存在"));
        res.cc("该账户不存在");
      } else if (!bcrypt.compareSync(user_password, admin.user_password)) {
        // 密码解密
        console.log(chalk.yellow("密码错误"));
        res.cc("密码错误");
      } else {
        // 向session中存入标识
        console.log(chalk.yellow(admin.user_id));
        req.session.admin_id = admin.user_id;
        // console.log(req.session);
        res.send({
          status: 0,
          // 运维管理人员 角色标识 admin
          role: "admin",
          // token 用于前端权限验证
          token: admin.user_id,
          message: "登陆成功",
        });
      }
    } catch (error) {
      console.log(chalk.red("登录管理员失败") + error.message);
      res.cc("登录管理员失败");
    }
  }
  async register(req, res, next) {
    var { user_name, user_password } = req.body;
    // 是否拥有
    try {
      if (!user_name || !user_password) {
        throw new Error("信息要填写完整哦");
      }
    } catch (error) {
      res.cc(error.message);
      return;
    }
    // 是否存在
    try {
      const admin = await AdminModel.findOne({ user_name });
      if (admin) {
        res.cc("该用户已经存在");
      } else {
        const user_level = 1; //权限等级
        const user_id = await this.getId("admin_id");
        user_password = await bcrypt.hashSync(user_password, 10);
        const newAdmin = {
          user_id,
          user_name,
          user_password,
          user_level,
        };
        // 创建实例
        await AdminModel.create(newAdmin);
        res.send({
          status: 1,
          msg: "成功注册",
        });
      }
    } catch (error) {
      console.log(chalk.red("注册管理员失败" + error));
      res.cc("注册失败");
    }
  }
  async singout(req, res, next) {
    try {
      delete req.session.admin_id;
      res.send({
        status: 1,
        success: "退出成功",
      });
    } catch (error) {
      console.log(chalk.red("退出失败" + err.message));
      res.cc("退出失败");
    }
  }
  async updateAvatar(req, res, next) {
    // console.dir(req);

    const admin_id = req.params.admin_id;
    if (!admin_id || !Number(admin_id)) {
      console.log(chalk.red("admin_id参数不存在", admin_id));
      res.cc("admin_id为空");
      return;
    }
    try {
      const img_path = await this.getPath(req, res);
      // 更新Admin头像
      await AdminModel.findOneAndUpdate(
        { user_id: admin_id },
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
  async getAdminInfo(req, res, next) {
    const admin_id = req.session.admin_id;
    if (!admin_id || !Number(admin_id)) {
      res.cc("获取管理员的信息失败");
      return;
    }
    try {
      const info = await AdminModel.findOne(
        { user_id: admin_id },
        "user_name user_phone avatar user_level"
      );
      if (!info) {
        throw new Error("未找到当前管理员");
      }
      res.send({ status: 1, data: info });
    } catch (error) {
      res.cc(error.message);
    }
  }
  async getAllAdmin(req, res, next) {
    const { limit = 10, offset = 0 } = req.query;
    try {
      const allAdmin = await AdminModel.find({}, "-_id -user_id -user_password")
        .sort({ user_id: 1 })
        .skip(Number(offset))
        .limit(Number(limit));
      res.send({
        status: 1,
        data: allAdmin,
      });
    } catch (error) {
      console.log(chalk.red("获取管理员列表失败", error));
      res.cc("获取管理员列表失败");
    }
  }
}

export default new Admin();
