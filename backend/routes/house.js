import express from "express";

import expressJoi from "@escook/express-joi";

import house from "../controller/house/house.js";

const router = express.Router();

// 添加房屋
router.post("/add", house.pushHouse);

// 管理员用
router.get("/getAllInfoByEstate_id", house.getAllHouseByEstate_id);

// 上传图片
router.post("/uploadHouseImg", house.updateLoadImg);

router.get("/getAllHouse", house.getHouseInfo);
// 客户端详情用
router.get("/getInfoByHouse_id", house.getHouseInfoByHouse_id);

router.delete("/deleteById", house.deleteHouseInfoByHouse_id);
export default router;
