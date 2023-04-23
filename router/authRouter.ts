import express from "express";
import { registerUser, loginUser } from "../controller/authController";

const router = express.Router();

router.post("/signUp", registerUser)
router.post('/login', loginUser)

export default router;