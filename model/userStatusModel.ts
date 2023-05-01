import mongoose from "mongoose"

interface OnlineUserType {
    socketID: string,
    userID: string
}

const OnlineUserSchema = new mongoose.Schema<OnlineUserType>(
    {
        socketID: {type: String, required: true},
        userID: {type: String, required: true},
    }
)

export const OnlineUser = mongoose.model("OnlineUser", OnlineUserSchema);