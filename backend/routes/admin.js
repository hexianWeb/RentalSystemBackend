"use strict";

import express from "express";

// 引入表单验证中间件
import expressJoi from "@escook/express-joi";

// 导入admin登录验证规则
import { admin_login_shcema } from "../schema/admin/admin.js";

// 引入admin的controller层
import Admin from "../controller/admin/admin.js";

import User from "../controller/user/user.js";

import Check from "../middlewares/check.js";

// import multer from "multer";

const router = express.Router();

// const upload = multer({ dest: "../tmp" });

// 加入验证Joi后，所发送的数据 会先通过expressJoi匹配是否合格，合格按原逻辑进行操作 不合格就会爆出全局ERR 由全局错误处理中间件处理
router.post("/login", expressJoi(admin_login_shcema), Admin.login);

router.post("/register", expressJoi(admin_login_shcema), Admin.register);

router.get("/signout", Check.checkAdmin, Admin.singout);

router.get("/getInfo", Check.checkAdmin, Admin.getAdminInfo);

router.get("/getAllAdmin", Check.checkAdmin, Admin.getAllAdmin);

router.post("/upload/avatar/:admin_id", Check.checkAdmin, Admin.updateAvatar);

// // 查看用户信息
// router.get(".getAllUser", Check.checkAdmin, User.getAllUser);

export default router;
