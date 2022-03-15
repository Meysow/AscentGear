import type { NextApiResponse } from 'next';
import nc from 'next-connect';
import dbConnect from '../../../lib/dbConnect';
import Product from '../../../models/Product';

const handler = nc();

handler.get(async (_, res: NextApiResponse) => {
    await dbConnect();
    const categories = await Product.find().distinct('category');
    res.send(categories);
    // res.status(200).json({
    //     message: 'succesfully uploaded categories',
    //     categories,
    // });
});

export default handler;
