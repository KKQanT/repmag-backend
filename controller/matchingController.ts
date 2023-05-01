import mongoose from "mongoose";
import { User } from "../model/userModel";
import { MatchingState } from "../model/MatchingModel";
import { Request, Response } from "express";

export async function getMatched(req: Request, res: Response) {
    try {
        const userID = (req as any).userID;
        const queryResultsB = await MatchingState.find({ userA: userID });
        const queryResultsA = await MatchingState.find({ userB: userID });
        const matchingList = [];
        if (queryResultsB.length > 0) {
            for (let i = 0; i < queryResultsB.length; i++) {
                matchingList.push(queryResultsB[i].userB)
            }
        }
        if (queryResultsA.length > 0) {
            for (let i = 0; i < queryResultsA.length; i++) {
                matchingList.push(queryResultsA[i].userA)
            }
        }

        const uniqueMatchList = matchingList.filter(
            (elem: any, index: any, arr: any) => arr.indexOf(elem) === index
        );

        const matchedUsers = await User.find({
            userID: { $in: uniqueMatchList }
        });

        res.status(200).send(matchedUsers)
    } catch (err) {
        res.status(500).send({ message: (err as any).message })
    }
}