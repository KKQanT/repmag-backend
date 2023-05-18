import mongoose from "mongoose";

interface ChatHistoryType {
    fromUserID: string,
    toUserID: string,
    message: string,
    isRead: boolean 
}

const ChatHistorySchema = new mongoose.Schema<ChatHistoryType>(
    {   
        fromUserID: {type: String, required: true},
        toUserID: {type: String, required: true},
        message: {type: String, required: true},
        isRead: {type: Boolean, default: false},
    },
    {timestamps:true}
);

export const ChatHistory = mongoose.model("ChatHistory", ChatHistorySchema);