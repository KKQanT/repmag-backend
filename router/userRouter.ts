import express from "express";
import { verifyAndDecodedJWT } from "../auth";
import { updateUserData } from "../controller/userController";

const router = express.Router();

router.post("/updateUserData", verifyAndDecodedJWT, updateUserData);

export default router;