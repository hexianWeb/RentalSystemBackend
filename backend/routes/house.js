import express from "express";

import expressJoi from "@escook/express-joi";

import house from "../controller/house/house.js";

import multer from "multer";

// app.use(multer({ dest: "../tmp" }));

const router = express.Router();

const upload = multer({ dest: "../tmp" });
router.post("/add", upload.single("file"), house.pushHouse);

export default router;
