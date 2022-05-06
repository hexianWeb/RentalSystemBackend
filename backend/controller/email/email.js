import EmailModel from "../../models/email/email.js";

import UserModel from "../../models/user/user.js";

import { sendMailer, sendMailer2 } from "../../util/emailSender.js";
class Email {
  constructor() {
    this.emailForReg = this.emailForReg.bind(this);
    this.emailForPwd = this.emailForPwd.bind(this);
  }
  // 邮箱验证
  async emailForReg(req, res, next) {
    const { email } = req.body;
    let vire = this.randomFns();
    sendMailer(email, "注册账号", vire);
    res.send({
      status: 1,
      message: "等待验证码验证",
    });
  }
  // 租房成功
  async emailForHouse(email) {
    try {
      const user = await UserModel.findOne({ user_email: email });
      if (!user) {
        throw new Error("邮箱尚未注册账户");
      }
    } catch (error) {
      res.cc(error.message);
      return;
    }
    sendMailer2(email);
  }
  // 找回密码 修改密码
  async emailForPwd(req, res, next) {
    const { email } = req.body;
    try {
      const user = await UserModel.findOne({ user_email: email });
      if (!user) {
        throw new Error("邮箱尚未注册账户");
      }
    } catch (error) {
      res.cc(error.message);
      return;
    }
    let vire = this.randomFns();
    sendMailer(email, "重置密码", vire);
    res.send({
      status: 1,
      message: "等待验证码验证",
    });
  }
  randomFns = () => {
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += parseInt(Math.random() * 10);
    }
    return code;
  };
}

export default new Email();
