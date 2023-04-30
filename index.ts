import express, {Application, Request, Response} from "express";
import http from "http";
import bodyParser from "body-parser";
import authRouter from "./router/authRouter";
import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";
import cors from "cors";
import { User } from "./model/userModel";
import userRouter from "./router/userRouter";
import {Server, Socket} from "socket.io";

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

app.get('/', async (req: Request, res: Response) => {
    res.send('<h1>Express backend</h1>');

    //const record = await User.findOneAndDelete({email: "admin"}); console.log(record);

    //const records = await User.find(); console.log(records);
});

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket: Socket) => {
    console.log("A user connected");

    socket.on('disconnect', () => {
        console.log('A user disconnected')
    })
})

server.listen(port, () => {
    console.log(`Socket is listening on port ${port}`);
  });