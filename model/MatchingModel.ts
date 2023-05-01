import mongoose, { Schema, Document, Types } from 'mongoose';

interface MatchingType {
    userA: string;
    userB: string;
    isLiked: boolean;
    isMatched: boolean;
}

const MatchingSchema = new mongoose.Schema<MatchingType>(
    {
        userA: {type: String, required: true},
        userB: {type: String, required: true},
        isLiked: { type: Boolean, required: true },
        isMatched: { type: Boolean, default: false, required: true },
    },
    {
        timestamps: true
    });

    export const MatchingState = mongoose.model("MatchingState", MatchingSchema);