import express from "express";
import { registerUser } from "../controller/authController";

const router = express.Router();

router.post("/signUp", registerUser)
router.post('/login', )

export default router;