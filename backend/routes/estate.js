import express from "express";

import expressJoi from "@escook/express-joi";

import Estate from "../controller/estate/estate.js";

import check from "../middlewares/check.js";

// TODO:增加数据验证
const router = express.Router();

// 已经在外部挂载路由验证管理员（弃用）
router.post("/add", check.checkAdmin, Estate.addEstate);

router.get("/getAll", check.checkAdmin, Estate.getAllEstate);

router.delete("/deleteById/:estate_id", check.checkAdmin, Estate.deleteById);

router.post("/update", check.checkAdmin, Estate.updateEstate);

export default router;
