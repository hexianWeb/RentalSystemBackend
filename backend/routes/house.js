import express from "express";

import expressJoi from "@escook/express-joi";

import house from "../controller/house/house.js";

const router = express.Router();

router.post("/add", house.pushHouse2);

// router.post("/updateImg", house.pushHouseImg);
router.get("/getAllInfo", house.getAllHouseByEstate_id);

router.get("/getInfo", house.getHouseInfoByHouse_id);

router.delete("/deleteById", house.deleteHouseInfoByHouse_id);
export default router;
