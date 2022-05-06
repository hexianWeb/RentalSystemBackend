import express from "express";

import ids from "../controller/ids/ids.js";
const router = express.Router();

router.get("/configPage", ids.getTotal);
export default router;
