import AdminModel from "../models/admin/admin.js";

import UserModel from "../models/user/user.js";
class Check {
  constructor() {}

  async checkAdmin(req, res, next) {
    const admin_id = req.session.admin_id;
    if (!admin_id || !Number(admin_id)) {
      res.cc("您还尚未登录");
      return;
    } else {
      const admin = await AdminModel.findOne({ id: admin_id });
      if (!admin) {
        res.cc("您不是管理员");
        return;
      }
    }
    next();
  }

  async checkUser(req, res, next) {
    const user_id = req.session.user_id;
    if (!user_id || !Number(user_id)) {
      res.cc("你还尚未登录");
      return;
    } else {
      const user = await UserModel.findOne({ user_id });
      if (!user) {
        res.cc("您还未注册");
      }
    }
    next();
  }
}

export default new Check();
