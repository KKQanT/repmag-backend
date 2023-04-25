import express from "express";
import http from "http";
import bodyParser from "body-parser";
import authRouter from "./router/authRouter";
import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";
import cors from "cors";

dotenv.config();

const port = process.env.PORT!;

const app = express();

mongoose.connect(
    process.env.MONGODB_URI!,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions
)
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

app.use(cors())
app.use(express.json())
app.use("/auth", authRouter)

app.get('/', (req, res) => {
    res.send('<h1>Express backend</h1>');
});

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Socket is listening on port ${port}`);
  });