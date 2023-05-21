import { User } from "../model/userModel";
import { Request, Response } from "express";

enum Gender {
    Man = "man",
    Woman = "woman",
}

interface updateUserData {
    name: string;
    gender: Gender;
    interestedIn: Gender

}

export async function updateUserData(
    req: Request, res: Response
) {
    try {
        const body: updateUserData = req.body;
        //@ts-ignore
        const filter = { email: req.email };
        const record = await User.findOneAndUpdate(filter, body);
        res.status(200).send({ message: 'profile updated' });

    } catch (err) {
        res.status(500).send({ message: (err as any).message })
    }

}

export async function getSelfProfile(req: Request, res: Response) {
    try {
        //@ts-ignore
        const filter = { email: req.email };
        const record = await User.findOne(filter).select("-" + ["salt", "hashedPassword"].join(' -'));
        res.status(200).send(record);
    } catch (err) {
        res.status(500).send({ message: (err as any).message });
    }
}

export async function getRecommendedUsers(req: Request, res: Response) {
    try {
        const excludedFields = ["salt", "hashedPassword"];
        const records = await User.aggregate([
            { $sample: { size: 100 } },
            { $sort: { createdAt: -1 } },
            { $limit: 25 },
            { $project: { _id: 0, ...excludedFields.reduce((obj, field) => ({ ...obj, [field]: 0 }), {}) } }

        ]); //to do filter those who A has already liked first 
        //@ts-ignore       
        const filteredRecords = records.filter((item) => item.userID !== req.userID)
        res.status(200).send(filteredRecords);
    } catch (err) {
        res.status(500).send({ message: (err as any).message });
    }
}