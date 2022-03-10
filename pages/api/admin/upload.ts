import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { isAuth, isAdmin } from '../../../app/utils/auth';
import { onError } from '../../../app/utils/error';
import { v2 as cloudinary } from 'cloudinary';
import dbConnect from '../../../lib/dbConnect';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '5mb',
        },
    },
};

const handler = nextConnect({ onError });
handler.use(isAuth, isAdmin);

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();
    try {
        const fileStr = req.body.data;
        const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'dev_setups',
        });
        res.json({
            message: 'Successfully uploaded !',
            url: uploadedResponse.secure_url,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Something wrong Happend in upload',
        });
    }
});

export default handler;
