import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const UserSchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        salt: { type: String, required: true },
        hashedPassword: {type: String, required: true},
        name: {type: String, default: null},
        gender: {type: String, enum: ["Man", "Woman", "Transgender", "Non-Binary", null], default:null},
        interestedIn: {type: String, enum: ["Man", "Woman", "Transgender", "Non-Binary", null], default:null},
        //to do make interetedIn ---> to object
    },
    { timestamps: true }
)

export const User = mongoose.model("User", UserSchema);
