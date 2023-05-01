import express, { Application, NextFunction, Request, Response } from "express";
import http from "http";
import bodyParser from "body-parser";
import authRouter from "./router/authRouter";
import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";
import cors from "cors";
import { User } from "./model/userModel";
import userRouter from "./router/userRouter";
import { Server, Socket } from "socket.io";
import { verifyAndDecodedJWT } from "./auth";
import { OnlineUser } from "./model/userStatusModel";
import { PrivateMessageArgs } from "./types";
import { ChatHistory } from "./model/chatHistoryModel";
import { MatchingState } from "./model/MatchingModel";
import matchRouter from "./router/matchingRouter";

declare module "socket.io" {
    interface Socket {
        userID: string,
    }
}

dotenv.config();

const port = process.env.PORT!;

const app: Application = express();

mongoose.connect(
    process.env.MONGODB_URI!,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions
)
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
}) as ConnectOptions;

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use('/match', matchRouter)

app.get('/', async (req: Request, res: Response) => {
    res.send('<h1>Express backend</h1>');

    //const record = await User.findOneAndDelete({email: "admin"}); console.log(record);

    //const records = await User.find(); console.log(records);
    //await OnlineUser.deleteMany();
    const records = await OnlineUser.find(); console.log(records);
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    allowEIO3: true
});

io.use((socket: Socket, next: any) => {
    try {
        const bearerToken = socket.handshake.auth.bearerToken;
        const userID = verifyAndDecodedJWT(bearerToken);
        if (userID) {
            socket.userID = userID;
            next();
        } else {
            console.error("socket auth error: cant decode jwt") //todo return to frontedn
            return next(new Error("socket auth error: cant decode jwt"))
        }
    } catch (err) {
        console.error("socket auth error:" + err)
        return next(new Error("socket auth error:" + err))
    }
})

io.on('connection', (socket: Socket) => {
    
    console.log("A user connected: ", socket.id);
    
    const userID = socket.userID;
    const onlineUser = new OnlineUser({ socketID: socket.id, userID: userID });
    onlineUser.save();
    io.emit('user online', userID); //to do : make it only to every user that matched to this user
    console.log("A user online successfully: ", socket.userID, ' ', socket.id);

    socket.on('disconnect', async () => {
        console.log('A user disconnected');
        try {
            const queryResult = await OnlineUser.findOne({ socketID: socket.id });
            const userID = queryResult?.userID;
            console.log('userID', ' ', userID)
            await OnlineUser.findOneAndDelete({ socketID: socket.id });
            const onlineUser = await OnlineUser.findOne({ userID: userID });
            if (!onlineUser) {
                console.log("A user completly offline: ", userID);
                io.emit("user offline", userID); //to do : make it only to every user that matched to this user
            }
        }
        catch (err) {
            console.error("disconnect error: " + err);
        }
    });

    socket.on("private message", async (args: PrivateMessageArgs) => {

        try {

            const fromUserID = socket.userID;

            console.log("message from: ", fromUserID);

            //store message in DB
            const chatHistoryToSave = new ChatHistory({
                fromUserID: fromUserID,
                toUserID: args.toUserID,
                message: args.message
            });

            chatHistoryToSave.save();

            const queryResult = await OnlineUser.find({ userID: args.toUserID });
            if (queryResult.length > 0) {
                // send offline message
                const toSocketIDs = queryResult.map((item) => { return item.socketID });
                toSocketIDs.forEach((toSocketID) => {
                    const toSocket = io.sockets.sockets.get(toSocketID);
                    if (toSocket) {
                        toSocket.emit("private message", args)
                    }
                });

            }
        } catch (err) {
            console.error("private message err: " + err)
        }
    });


})

server.listen(port, () => {
    console.log(`Socket is listening on port ${port}`);
});