import { ChatHistory } from "../model/chatHistoryModel";
import { Request, Response } from "express";

export async function getChatHistory(req: Request, res: Response) {
    try {
        const userID = (req as any).userID;
        const partnerID = req.params.partnerID;
        const queryResultsA = await ChatHistory.find({fromUserID: userID, toUserID: partnerID});
        const queryResultsB = await ChatHistory.find({fromUserID: partnerID, toUserID: userID});
        const queryResults = [...queryResultsA, ...queryResultsB];
        //@ts-ignore
        queryResults.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        res.status(200).send(queryResults);
    } catch (err) {
        res.status(500).send({ message: (err as any).message })
    }
}

export async function updateReadStatus(req: Request, res: Response) {
    try {
        const userID = (req as any).userID;
        const partnerID = req.params.partnerID;
        await ChatHistory.updateMany({
            fromUserID: partnerID,
            toUserID: userID,  
            isRead: false},
            {isRead: true})
    } catch (err) {
        res.status(500).send({ message: (err as any).message })
    }
}