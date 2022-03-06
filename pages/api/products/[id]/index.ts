import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import dbConnect from '../../../../lib/dbConnect';
import Product from '../../../../models/Product';

const handler = nc();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();

    try {
        const product = await Product.findById(req.query.id);
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false });
    }
});

export default handler;
