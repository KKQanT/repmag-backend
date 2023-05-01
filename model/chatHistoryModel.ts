import mongoose from "mongoose";

interface ChatHistoryType {
    fromUserID: string,
    toUserID: string,
    message: string,
}

const ChatHistorySchema = new mongoose.Schema<ChatHistoryType>(
    {
        fromUserID: {type: String, required: true},
        toUserID: {type: String, required: true},
        message: {type: String, required: true}
    },
    {timestamps:true}
);

export const ChatHistory = mongoose.model("ChatHistory", ChatHistorySchema);