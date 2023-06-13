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
    try {
      const record = await ImageRecord.findOne({ userID: (req as any).userID })
        .sort({ order: -1 })
        .select('order');
      let recent_order = 0;
      if (record) {
        recent_order = record.order.valueOf();
      }
      const newRecord = new ImageRecord();
      newRecord.imageID = uuidv4();
      newRecord.order = recent_order + 1;
      newRecord.userID = (req as any).userID;
      newRecord.data = await fs.promises.readFile((req.file?.path as PathLike));
      newRecord.save();
      await fs.promises.unlink(req.file?.path as PathLike);
      res.status(200).send(newRecord);

    } catch (err: any) {
      console.log(err)
      res.status(500).send({ "err": err.message })
    }
  }
)

router.put(
  "/update_image",
  uploader.single('file'),
  verifyAndDecodedJWTInReq,
  async (req: Request, res: Response) => {
    try {
      await ImageRecord.findOneAndUpdate(
        { userID: (req as any).userID, imageID: req.body.imageID },
        { data: await fs.promises.readFile((req.file?.path as PathLike)) }
      );
      const updatedRecord = await ImageRecord.findOne(
        { userID: (req as any).userID, imageID: req.body.imageID },
      )
      await fs.promises.unlink(req.file?.path as PathLike);
      res.status(200).send(updatedRecord);
    } catch (err: any) {
      console.log(err)
      res.status(500).send({ "err": err.message })
    }
  }
)

router.get(
  '/get_images/:user_id',
  verifyAndDecodedJWTInReq,
  async (req: Request, res: Response) => {
    try {
      const records = await ImageRecord.find({
        userID: req.params.user_id
      })

      console.log(records.map((item) => item.imageID))

      if (records) {
        res.status(200).send(records)
      }
    } catch (err: any) {
      console.log(err)
      res.status(500).send({ err: err.message })
    }
  }
)

router.post(
  '/delete_image/',
  verifyAndDecodedJWTInReq,
  async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const imageID = body.imageID;
      const userID = (req as any).userID;
      console.log("userID", userID)
      console.log("imageID", imageID)
      const recordToDelete = await ImageRecord.findOne({imageID: imageID, userID: userID});
      if (recordToDelete) {
        await ImageRecord.updateMany(
          {userID: userID, order: {$gt: recordToDelete.order}},
          {$inc: {order: -1}}
          );
        await ImageRecord.deleteOne({imageID: imageID, userID: userID});
      }
      res.status(200).send("image removed");
    }
    catch (err: any) {
      console.log(err)
      res.status(500).send({ err: err.message })
    }
  }
)

export default router;

//https://colinrlly.medium.com/send-store-and-show-images-with-react-express-and-mongodb-592bc38a9ed