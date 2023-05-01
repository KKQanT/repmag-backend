import express from "express";
import { verifyAndDecodedJWTInReq } from "../auth";
import {
    getSelfProfile,
    updateUserData,
    getRecommendedUsers
} from "../controller/userController";

const router = express.Router();

router.post("/updateUserData", verifyAndDecodedJWTInReq, updateUserData);
router.get('/getSelfProfile', verifyAndDecodedJWTInReq, getSelfProfile)
router.get('/getRecommendedUsers', verifyAndDecodedJWTInReq, getRecommendedUsers)

export default router;