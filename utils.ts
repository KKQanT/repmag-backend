import { OnlineUser } from "./model/userStatusModel"
import { Server as SocketIOServer } from "socket.io";

const broadcaseEventToUserID = async (
    io: SocketIOServer, userID: string, eventName: string, args: any
) => {
    console.log(`broadcasted: ${eventName} ${args}`)
    const queriedOnlineUser = await OnlineUser.find({ userID: userID });
    if (queriedOnlineUser.length > 0) {
        const toSocketIDs = queriedOnlineUser.map((item) => { return item.socketID });
        console.log('to socket ', toSocketIDs)
        toSocketIDs.forEach((toSocketID) => {
            const toSocket = io.sockets.sockets.get(toSocketID);
            if (toSocket) {
                toSocket.emit(eventName, args)
            }
        })
    }
}

const broadcaseEventToOtherTab = async (
    io: SocketIOServer, selfSocketID: string, selfUserID: string, eventName: string, args: any
) => {
    console.log(`self broadcasted: ${eventName} ${args}`)
    const queriedOnlineUser = await OnlineUser.find({ userID: selfUserID });
    if (queriedOnlineUser.length > 0) {
        const toSocketIDs = queriedOnlineUser.map((item) => { return item.socketID });
        console.log('to socket ', toSocketIDs)
        toSocketIDs.forEach((toSocketID) => {
            if (toSocketID !== selfSocketID) {
                const toSocket = io.sockets.sockets.get(toSocketID);
                if (toSocket) {
                    toSocket.emit(eventName, args)
                }
            }
        })
    }
}

export { broadcaseEventToUserID, broadcaseEventToOtherTab };