import express from "express";
import { verifyAndDecodedJWTInReq } from "../auth";
import { getChatHistory } from "../controller/chatController";

const router = express.Router();

router.get('/chatHistory/:partnerID', verifyAndDecodedJWTInReq, getChatHistory)

export default router;