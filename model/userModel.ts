import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const UserSchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        salt: { type: String, required: true },
        hashedPassword: {type: String, required: true}
    },
    { timestamps: true }
)

export const User = mongoose.model("User", UserSchema);
