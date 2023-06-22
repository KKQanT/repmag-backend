import express from "express";
import { registerUser, loginUser, googleLogin } from "../controller/authController";

const router = express.Router();

router.post("/signUp", registerUser);
router.post('/login', loginUser);
router.post('/google_login', googleLogin);

export default router;