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
        res.status(200).send({
            name: record?.name,
            gender: record?.gender,
            university: record?.university,
            age: record?.age,
            occupation: record?.occupation,
            preferences: record?.preferences,
        });
        
    } catch (err) {
        res.status(500).send({message: (err as any).message})
    }
    
}

export async function getSelfProfile(req: Request, res: Response) {
    try {
        //@ts-ignore
        const filter = {email: req.email};
        const record = await User.findOne(filter);
        res.status(200).send({
            name: record?.name,
            gender: record?.gender,
            university: record?.university,
            age: record?.age,
            occupation: record?.occupation,
            preferences: record?.preferences,
        })
    } catch (err) {
        res.status(500).send({message: (err as any).message})
    }
}