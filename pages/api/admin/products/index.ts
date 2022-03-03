import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { isAuth, isAdmin } from '../../../../app/utils/auth';
import Product from '../../../../models/Product';
import dbConnect from '../../../../lib/dbConnect';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();
    const orders = await Product.find({});
    res.send(orders);
});

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();
    const newProduct = new Product({
        name: 'sample name',
        slug: 'sample-slug-' + Math.random(),
        image: '/images/shirt1.jpg',
        price: 0,
        category: 'sample category',
        brand: 'sample brand',
        countInStock: 0,
        description: 'sample description',
        rating: 0,
        numReviews: 0,
    });

    const product = await newProduct.save();
    res.send({ message: 'Product Created', product });
});

export default handler;
