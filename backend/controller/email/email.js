import EmailModel from "../../models/email/email.js";

import UserModel from "../../models/user/user.js";

import { sendMailer } from "../../util/emailSender.js";
class Email {
  constructor() {
    this.emailForReg = this.emailForReg.bind(this);
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

  // 找回密码 修改密码
  async emailForPwd(req, res, next) {
    const { email } = req.body;
    try {
      let user = UserModel.findOne({ email });
      if (!user) {
        // throw new Error(())
      }
    } catch (error) {}
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
