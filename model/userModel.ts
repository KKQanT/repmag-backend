import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const UserSchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        salt: { type: String, required: true },
        hashedPassword: {type: String, required: true},
        name: {type: String, default: ""},
        gender: {type: String, enum: ["Man", "Woman", "Transgender", "Non-Binary", ""], default:""},
        interestedIn: {type: String, enum: ["Man", "Woman", "Transgender", "Non-Binary"], default:""},
    },
    { timestamps: true }
)

export const User = mongoose.model("User", UserSchema);
