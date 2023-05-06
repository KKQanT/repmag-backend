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
import { broadcaseEventToOtherTab, broadcaseEventToUserID } from "./utils";
import chatHistoryRouter from "./router/chatRouter";

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
app.use('/chat/', chatHistoryRouter)

app.get('/', async (req: Request, res: Response) => {
    res.send('<h1>Express backend</h1>');

    //const record = await User.findOneAndDelete({email: "admin"}); console.log(record);

    //const records = await User.find(); console.log(records);
    //await MatchingState.deleteMany();
    //const records = await MatchingState.find(); console.log(records);
    //await OnlineUser.deleteMany()
    //console.log(await OnlineUser.find())
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
            console.log("message: ", args.message);

            //store message in DB
            const chatHistoryToSave = new ChatHistory({
                fromUserID: fromUserID,
                toUserID: args.toUserID,
                message: args.message,
            });

            chatHistoryToSave.save();

            args.fromUserID = fromUserID;

            await broadcaseEventToUserID(io, args.toUserID, "private message", args);
            await broadcaseEventToOtherTab(io, socket.id, userID, "self private message", args);
        } catch (err) {
            console.error("private message err: " + err)
        }
    });

    socket.on("match notify", async (
        { targetUserID }: { targetUserID: string }
    ) => {
        try {
            const queryUserResult = await User.findOne({ userID: socket.userID });
            if (queryUserResult) {
                await broadcaseEventToUserID(
                    io, targetUserID, "match notify", {name: queryUserResult.name});
            } else {
                console.log('match notify error : no user found')
            }
        }
        catch (err) {
            console.log('match notify error :' + (err as any).message)
        }
    })

    socket.on("liked notify", async (
        { targetUserID }: { targetUserID: string }
    ) => {
        try {
            console.log('liked notify invoked')
            const queryUserResult = await User.findOne({userID: socket.userID});
            if (queryUserResult) {
                console.log('liked notify invoked 2')
                await broadcaseEventToUserID(
                    io, targetUserID, "liked notify", {name: queryUserResult.name}
                )
            } else {
                console.log('liked notify error : no user found')
            }
         } 
        catch (err) {}
    })


})

server.listen(port, () => {
    console.log(`Socket is listening on port ${port}`);
});