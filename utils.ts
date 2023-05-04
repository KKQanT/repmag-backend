import { OnlineUser } from "./model/userStatusModel"
import { Server as SocketIOServer } from "socket.io";

const broadcaseEventToUserID = async ( 
    io: SocketIOServer, userID: string, eventName: string, args: any
) => {
    console.log('broadcasted')
    const queriedOnlineUser = await OnlineUser.find({userID: userID});
    if (queriedOnlineUser.length > 0) {
        const toSocketIDs = queriedOnlineUser.map((item) => {return item.socketID});
        toSocketIDs.forEach((toSocketID) => {
            const toSocket = io.sockets.sockets.get(toSocketID);
            if (toSocket) {
                toSocket.emit(eventName, args)
            }
        })
    }
}

export {broadcaseEventToUserID};