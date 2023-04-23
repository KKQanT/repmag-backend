import { generateAccessToken, hashPassword } from "../auth";
import { User } from "../model/userModel";
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
            res.status(202).send({ error_message: "username exist" })
        }

    } catch (err: any) {
        res.status(201).send({ error_message: err.message })
    }

}