import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import dbConnect from '../../../lib/dbConnect';
import Product from '../../../models/Product';

const handler = nc();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect;
    const categories = await Product.find().distinct('category');
    res.send(categories);
});

export default handler;
