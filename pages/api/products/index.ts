import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import dbConnect from '../../../lib/dbConnect';
import Product from '../../../models/Product';

const handler = nc();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();

    try {
        const products = await Product.find(
            {}
        ); /* find all the data in our database */
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(400).json({ success: false });
    }
});

export default handler;
