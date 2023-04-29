import express from "express";
import { verifyAndDecodedJWT } from "../auth";
import { getSelfProfile, updateUserData } from "../controller/userController";

const router = express.Router();

router.post("/updateUserData", verifyAndDecodedJWT, updateUserData);
router.get('/getSelfProfile', verifyAndDecodedJWT, getSelfProfile)

export default router;