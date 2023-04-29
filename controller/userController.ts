import { User } from "../model/userModel";
import { verifyAndDecodedJWT } from "../auth";

enum Gender {
    Man = "Man",
    Woman = "Woman",
    Transgender = "Transgender",
    NonBinary = "Non-Binary",
    Null = ""
}

interface updateUserData {
    name: string;
    gender: Gender;
    interestedIn: Gender

}

export async function updateUserData(
    req: any, res: any
) {
    try {
        const body: updateUserData = req.body;
        const filter = { email: req.email };
        const record = await User.findOneAndUpdate(filter, body);
        res.status(200).send({
            name: record?.name,
            gender: record?.gender,
            interestedIn: record?.interestedIn
        });
        
    } catch (err) {
        res.status(500).send({message: (err as any).message})
    }
    
}

export async function getSelfProfile(req: any, res:any) {
    try {
        const filter = {email: req.email};
        const record = await User.findOne(filter);
        res.status(200).send({
            name: record?.name,
            gender: record?.gender,
            interestedIn: record?.interestedIn
        })
    } catch (err) {
        res.status(500).send({message: (err as any).message})
    }
}