import express from "express";
import { verifyAndDecodedJWTInReq } from "../auth";
import { getMatched, likeUser, passUser } from "../controller/matchingController";

const router = express.Router();

router.get("/getMatched", verifyAndDecodedJWTInReq, getMatched);
router.post('/likeUser', verifyAndDecodedJWTInReq, likeUser);
router.post('/passuser', verifyAndDecodedJWTInReq, passUser)

export default router;