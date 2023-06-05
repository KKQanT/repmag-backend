import multer from 'multer';
import express from "express";
import { verifyAndDecodedJWTInReq } from '../auth';
import { Request, Response } from "express";
import { ImageRecord } from '../model/imageModel';
import { v4 as uuidv4 } from "uuid";
import fs from 'fs';
import { PathLike } from 'fs';

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

const uploader = multer({ storage: storage });

const router = express.Router();

router.post(
    '/upload_image',
    uploader.single('file'),
    verifyAndDecodedJWTInReq,
    async (req: Request, res: Response) => {
        const imageRecord = new ImageRecord();
        imageRecord.imageID = uuidv4();
        imageRecord.order = 0;
        imageRecord.userID = (req as any).userID;
        imageRecord.data = await fs.promises.readFile((req.file?.path as PathLike));
        imageRecord.save()
        await fs.promises.unlink((req.file?.path as PathLike));
        res.json({ message: 'uploaded' })
    }
);

router.get(
    '/get_image/:filename',
    verifyAndDecodedJWTInReq,
    async (req: Request, res: Response) => {
        try {
            const record = await ImageRecord.findOne({
                order: 0
            })

            console.log(record)

            if (record) {
                res.status(200).send(record)
            }
        } catch (err) {
            console.log(err)
        }
    }
)

export default router;

//https://colinrlly.medium.com/send-store-and-show-images-with-react-express-and-mongodb-592bc38a9ed