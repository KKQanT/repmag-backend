import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";

interface UserProfile {
    userID: string;
    email: string;
    salt: string;
    hashedPassword: string;
    name: string | null;
    gender: "man"|"woman"|null;
    university: string | null;
    age: number | null;
    occupation: string | null;
    preferences: {
        gender: "man"|"woman"| null;
        ageRange : {min: number, max: number} | null;
        universities: string[] | null;
        occupations: string[] | null
    }

}

const UserSchema = new mongoose.Schema<UserProfile>(
    {
        userID: {type: String, required: true},
        email: { type: String, required: true },
        salt: { type: String, required: true },
        hashedPassword: {type: String, required: true},
        name: {type: String, default: null},
        gender: {type: String, enum: ["man","woman", null], default:null},
        university: {type: String, default: null},
        age: {type: Number, default: null},
        occupation: {type: String, default: null},
        preferences: {
            gender: {
                type: String,
                enum: ["man","woman", null],
                default: null
            },
            ageRange: {
                min: {type: Number, default: null},
                max: {type: Number, default: null}
            },
            universities: [{type: String}],
            occupations: [{type: String}]
        }

    },
    { timestamps: true }
)

export const User = mongoose.model("User", UserSchema);
