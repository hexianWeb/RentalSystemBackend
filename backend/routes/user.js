"use strict";

import express from "express";

import check from "../middlewares/check.js";
// 引入表单验证中间件
import expressJoi from "@escook/express-joi";

// 导入user登录验证规则
import {
  user_login_schema,
  user_register_shcema,
} from "../schema/user/user.js";

// 引入UserController
import User from "../controller/user/user.js";

// 加入验证Joi后，所发送的数据 会先通过expressJoi匹配是否合格，合格按原逻辑进行操作 不合格就会爆出全局ERR 由全局错误处理中间件处理
const router = express.Router();

// 用户用接口
router.post("/login", expressJoi(user_login_schema), User.login);

router.post("/register", expressJoi(user_register_shcema), User.register);

router.get("/signout", check.checkUser, User.singout);

router.post("/upload/avatar/:user_id", check.checkUser, User.updateAvatar);

router.get("/getInfo", check.checkUser, User.getUserInfo);

router.post("/updateInfo", check.checkUser, User.updateInfo);

// 更新密码
router.post("/updatePassword", check.checkUser, User.updateUserPassword);
// 管理员专用接口;
router.get("/getAllUser", check.checkAdmin, User.getAllUser);

//TODO:获取本日本月新增人数
router.get("/newUserNumber", check.checkAdmin, User.NewUserNumber);

export default router;
