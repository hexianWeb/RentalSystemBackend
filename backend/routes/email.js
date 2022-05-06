import expressJoi from "@escook/express-joi";

import express from "express";

import { email_checker } from "../schema/email/email.js";

import Email from "../controller/email/email.js";

const router = express.Router();

router.post("/reg", expressJoi(email_checker), Email.emailForReg);

router.post("/update", expressJoi(email_checker), Email.emailForPwd);

export default router;
