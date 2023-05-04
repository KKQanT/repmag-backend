import mongoose, { Schema, Document, Types } from 'mongoose';

interface MatchingType {
    userA: string;
    userB: string;
    isLiked: boolean;
    status: string;
}

const MatchingSchema = new mongoose.Schema<MatchingType>(
    {
        userA: {type: String, required: true},
        userB: {type: String, required: true},
        isLiked: { type: Boolean, required: true },
        status: { 
            type: String,
            enum: ["await", "matched", "pass", "unmatched"], 
            default: "await", 
            required: true 
        },
    },
    {
        timestamps: true
    });

    export const MatchingState = mongoose.model("MatchingState", MatchingSchema);