import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET!;

export function generateAccessToken(username: string) {
    return jwt.sign(username, JWT_SECRET, { expiresIn: "1800s" })
}

export function authorizeUser(req: any, res: any, next: any) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).send("Not authorized")
    }

    try {
        const decodedUser = jwt.verify(token, JWT_SECRET);
        req.user = decodedUser
        next()
    } catch (err) {
        res.status(400).send("Invalid token")
    }

}

export const hashPassword = function (password: string) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = crypto.pbkdf2Sync(
        password,
        salt,
        1000,
        64,
        "sha512"
    ).toString('hex');

    return [salt, hashedPassword]
};

export const validatePassword = function (
    password: string,
    salt: string,
    hashedPassword: string
) {
    const hash = crypto.pbkdf2Sync(
        password,
        salt,
        1000,
        64,
        'sha512'
    ).toString('hex');
    return hash === hashedPassword
};