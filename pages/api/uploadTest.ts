import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import dbConnect from '../../lib/dbConnect';
import { v2 as cloudinary } from 'cloudinary';

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

const handler = nc();

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();
    try {
        const fileStr = req.body.data;
        const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'dev_setups',
        });
        console.log(uploadedResponse);
        res.json({ message: 'Successfully uploaded !' });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Something wrong Happend in uploadTest',
        });
    }
});

export default handler;
