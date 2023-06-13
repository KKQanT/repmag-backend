import mongoose from "mongoose";

interface ImageRecordType {
    imageID: String,
    order: Number,
    userID: String
    data: Buffer,
    //contentType: String,
}

const ImageRecordSchema = new mongoose.Schema<ImageRecordType>(
    {
        imageID: {type: String, required: true},
        order: {type: Number, require: true},
        userID: {type: String, required: true},
        data: {type: Buffer, required: true},
        //contentType: {type: String, default: true}
    },
    {
        timestamps: true
    }
)

export const ImageRecord = mongoose.model("ImageRecord", ImageRecordSchema)