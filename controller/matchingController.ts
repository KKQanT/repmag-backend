import { User } from "../model/userModel";
import { MatchingState } from "../model/MatchingModel";
import  { Request, Response } from "express";

export async function getMatched(req: Request, res: Response) {
    try {
        const userID = (req as any).userID;
        const queryResultsB = await MatchingState.find({ userA: userID, status: "matched"});
        const queryResultsA = await MatchingState.find({ userB: userID, status: "matched" });
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
        }).select({
            age: 1,  gender: 1, name: 1, occupation: 1, university: 1, userID: 1, _id: 0
        });

        res.status(200).send(matchedUsers)
    } catch (err) {
        res.status(500).send({ message: (err as any).message })
    }
}

export async function likeUser(req: Request, res: Response) {
    try {
        const userID = (req as any).userID;
        const body = req.body;
        const targetUserID = body.targetUserID;
        const queryLikedResult = await MatchingState.findOne({ userA: targetUserID, userB: userID });
        if (queryLikedResult === null) {
            //add like
            const likeState = new MatchingState({
                userA: userID,
                userB: targetUserID,
                isLiked: true,
                status: "await"
            })
            likeState.save();
            res.status(200).send({'result': "liked"})
            //emit like from user
        } else {
            if (queryLikedResult.isLiked === true) {
                //it's a matched
                await MatchingState.findOneAndUpdate(
                    {userA: targetUserID, userB: userID}, 
                    {status: "matched"}
                    );
                res.status(200).send({'result': "matched"})
                //emit matching status
            } else {
                await MatchingState.findOneAndUpdate(
                    {userA: targetUserID, userB: userID},
                    {status: "pass"}
                );
                res.status(200).send({'result': "pass"})
            }
        }

    }
    catch (err) {
        res.status(500).send({'message': (err as any).message})
    }
}

export async function passUser(req: Request, res: Response) {
    try {
        const userID = (req as any).userID;
        const body = req.body;
        const targetUserID = body.targetUserID;
        const queryLikedResult = await MatchingState.findOne({ userA: targetUserID, userB: userID });
        if (queryLikedResult === null) {
            //add like
            const passState = new MatchingState({
                userA: userID,
                userB: targetUserID,
                isLiked: false,
                isMatched: "pass"
            })
            passState.save();
            res.status(200).send({'result': "pass"})
        } else {
            await MatchingState.findOneAndUpdate(
                {userA: targetUserID, userB: userID},
                {status: "pass"}
            );
            res.status(200).send({'result': "pass"})
        }
    } catch (err) {
        res.status(500).send({'message': (err as any).message})
    }
}