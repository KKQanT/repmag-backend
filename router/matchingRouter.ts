import express from "express";
import { verifyAndDecodedJWTInReq } from "../auth";
import { getMatched } from "../controller/matchingController";

const router = express.Router();

router.get("/getMatched", verifyAndDecodedJWTInReq, getMatched);

export default router;