import { Request } from "express";
import multer from "multer";
import { uuid } from "uuidv4";
import multerS3 from "multer-s3";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import path from "path";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_ACCESS_KEY_ID_SECRET as string,
  },
});
const BUCKET = process.env.AWS_BUCKET as string;

export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req: Request, file: any, cb: Function) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req: Request, file: any, cb: Function) {
      const ext = path.extname(file.originalname);
      cb(null, Date.now().toString() + `${uuid()}${ext}`);
    },
  }),
});

// function to delete an image from s3 bucket
export const deleteObject = async (imageId: any) => {
  const input = {
    Bucket: BUCKET,
    Key: imageId,
  };
  const command = new DeleteObjectCommand(input);
  const response = await s3.send(command);
  return response;
};
