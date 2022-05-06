import express from "express";

import spect from "../controller/spect/spect.js";

import router from "./admin.js";

// 用户端 请求看房
router.post("/add", spect.addSpect);

// 用户端 取消看房
router.delete("/deleteById", spect.deleteSpect);

// 用户端 确认租房
router.get("/getHouse", spect.getHouse);

// 管理员端 获取所有订单
router.get("/getAll", spect.getAllSpect);

// 管理端 修改订单状态 0=>1
router.get("/confirm", spect.confirmSpect);

router.get("/newSpectNumber", spect.newSpectNumber);

router.get("/newMoney", spect.newSpectMoney);

router.get("/echartM", spect.EchartMoney);
export default router;
