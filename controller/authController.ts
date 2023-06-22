import { generateAccessToken, hashPassword, validatePassword } from "../auth";
import { User } from "../model/userModel";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import e, { Request, Response } from "express";

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET!;

export async function registerUser(req: Request, res: Response) {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userRecord = await User.findOne({ email: email });
        if (userRecord === null) {
            let newUser = new User();
            const userID = uuidv4();
            newUser.userID = userID;
            newUser.email = email;
            const [salt, hashedPassword] = hashPassword(password);
            newUser.salt = salt;
            newUser.hashedPassword = hashedPassword;
            newUser.save();
            res.status(200).send({ message: "user registered" })

        } else {
            res.status(500).send({ message: "username exist" })
        }

    } catch (err: any) {
        res.status(201).send({ message: err.message })
    }

}

export async function loginUser(req: Request, res: Response) {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userRecord = await User.findOne({ email: email });
        if (userRecord === null) {
            res.status(202).send({ message: "could not find user" });
        } else {
            const salt = userRecord.salt;
            const hashedPassword = userRecord.hashedPassword;
            const validPassword = validatePassword(password, salt, hashedPassword);
            if (validPassword) {
                const token = jwt.sign({
                    userID: userRecord.userID, email: email
                }, JWT_SECRET);
                res.status(200).send({ bearerToken: token });
            } else {
                res.status(203).send({ message: "invalid password" })
                // to do : prevent bruteforce attack
            }
        }
    } catch (err: any) {
        res.status(201).send({ message: err.message })
    }
}

export async function googleLogin(req: Request, res: Response) {
    try {

        const decodedToken = jwt.decode(req.body.googleToken);
        console.log(decodedToken);
        const email = (decodedToken as any).email;
        const userRecord = await User.findOne({ email: email });
        if (userRecord === null) {
            let newUser = new User();
            const userID = uuidv4();
            newUser.userID = userID;
            newUser.email = email;
            newUser.isGoogleAccount = true;
            await newUser.save();
            const token = jwt.sign({
                userID: userID, email: email
            }, JWT_SECRET);
            res.status(200).send({ bearerToken: token });
        } else {
            const token = jwt.sign({
                userID: userRecord.userID, email: email
            }, JWT_SECRET);
            res.status(200).send({ bearerToken: token });
        }
    }
    catch (err) {
        console.log(err)
    }
}

//{
//    [1]   iss: 'https://accounts.google.com',
//    [1]   nbf: 1687439962,
//    [1]   aud: '147725688382-ma0o075udnkmj0cn0rlsrb04sbi0mvu0.apps.googleusercontent.com',
//    [1]   sub: '101613794781791663285',
//    [1]   email: 'peerakarn.jit@gmail.com',
//    [1]   email_verified: true,
//    [1]   azp: '147725688382-ma0o075udnkmj0cn0rlsrb04sbi0mvu0.apps.googleusercontent.com',
//    [1]   name: 'Peerakarn Jitpukdee',
//    [1]   picture: 'https://lh3.googleusercontent.com/a/AAcHTtf69xVns2rG7x95kqnNR6Ela8JE2wCU6F_Gxx-xiA=s96-c',
//    [1]   given_name: 'Peerakarn',
//    [1]   family_name: 'Jitpukdee',
//    [1]   iat: 1687440262,
//    [1]   exp: 1687443862,
//    [1]   jti: 'b98d1b66a066feed2a0f6510d19e0fb42f0665bf'
//    [1]
//}