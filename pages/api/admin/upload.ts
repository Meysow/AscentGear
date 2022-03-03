import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { isAuth, isAdmin } from '../../../app/utils/auth';
import { onError } from '../../../app/utils/error';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
    api: {
        bodyParser: false,
    },
};

const handler = nextConnect({ onError });
const upload = multer();

handler
    .use(isAuth, isAdmin, upload.single('file'))
    .post(async (req: NextApiRequest, res: NextApiResponse) => {
        const streamUpload = (req: any) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
        const result = await streamUpload(req);
        res.send(result);
    });

export default handler;
