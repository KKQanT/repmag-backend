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
    } catch (err: any) {
        res.status(400).send({ message: err.message })
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

export const verifyAndDecodedJWT = (
    req: any, res: any, next: any
) => {
    if (req.email) {
        res.status(400).send("Invalid token.")
    } else if (!req.bearerToken) {
        res.status(401).send("Invalid token.")
    } else {
        try {
            const decoded = jwt.verify(req.bearerToken, JWT_SECRET);
            const email: string = (decoded as any).email;
            if (email) {
                req.email = email;
                next();
            } else {
                res.status(402).send('Invalid token.')
            }

        } catch (err) {
            res.status(500).send("verification error")
        }
    }

}