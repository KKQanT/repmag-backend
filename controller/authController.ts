import { generateAccessToken, hashPassword, validatePassword } from "../auth";
import { User } from "../model/userModel";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET!;

export async function registerUser(req: any, res: any) {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userRecord = await User.findOne({ email: email });
        if (userRecord === null) {
            let newUser = new User();
            newUser.email = email;
            const [salt, hashedPassword] = hashPassword(password);
            newUser.salt = salt;
            newUser.hashedPassword = hashedPassword;
            newUser.save();
            res.status(200).send({ message: "user registered" })

        } else {
            res.status(202).send({ message: "username exist" })
        }

    } catch (err: any) {
        res.status(201).send({ message: err.message })
    }

}

export async function loginUser(req: any, res: any) {
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
                const token = jwt.sign({ email: email }, JWT_SECRET);
                res.status(200).send({ bearerToken: token });
            } else {
                res.status(203).send({message: "invalid password"})
                // to do : prevent bruteforce attack
            }
        }
    } catch (err: any) {
        res.status(201).send({ message: err.message })
    }
}