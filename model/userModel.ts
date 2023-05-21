import mongoose from "mongoose";

interface UserProfile {
    userID: string;
    email: string;
    salt: string;
    hashedPassword: string;
    name: string | null;
    gender: "man" | "woman" | null;
    university: string | null;
    age: number | null;
    occupation: string | null;
    userImages: string[],
    bio: string|null;
    interestedIn: string[],
    location: {
        city: string|null,
        country: string|null,
    };
    preferences: {
        gender: "man" | "woman" | null;
        ageRange: { min: number, max: number } | null;
        universities: string[] | null;
        occupations: string[] | null
    },
}

const UserSchema = new mongoose.Schema<UserProfile>(
    {
        userID: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        salt: { type: String, required: true },
        hashedPassword: { type: String, required: true },
        name: { type: String, default: null },
        gender: { type: String, enum: ["man", "woman", null], default: null },
        university: { type: String, default: null },
        age: { type: Number, default: null },
        occupation: { type: String, default: null },
        userImages: [{ type: String }],
        bio: { type: String, default: null },
        location: {
            city: { type: String, default: null },
            country: { type: String, default: null },
        },
        interestedIn: [{ type: String }],
        preferences: {
            gender: {
                type: String,
                enum: ["man", "woman", null],
                default: null
            },
            ageRange: {
                min: { type: Number, default: null },
                max: { type: Number, default: null }
            },
            universities: [{ type: String }],
            occupations: [{ type: String }]
        },

    },
    { timestamps: true }
)

export const User = mongoose.model("User", UserSchema);
