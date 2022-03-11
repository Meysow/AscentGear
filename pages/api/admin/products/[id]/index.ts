import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { isAuth, isAdmin } from '../../../../../app/utils/auth';
import Product from '../../../../../models/Product';
import dbConnect from '../../../../../lib/dbConnect';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();
    const product = await Product.findById(req.query.id);

    res.send(product);
});

handler.put(async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();
    const product = await Product.findById(req.query.id);
    if (product) {
        product.name = req.body.name;
        product.slug = req.body.slug;
        product.price = req.body.price;
        product.category = req.body.category;
        if (req.body.image) {
            product.image = req.body.image;
        } // Check if user updated the image, if not, keep the old image.
        product.brand = req.body.brand;
        product.countInStock = req.body.countInStock;
        product.description = req.body.description;
        await product.save();
        res.send({ message: 'Product Updated Successfully' });
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
});

handler.delete(async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();
    const product = await Product.findById(req.query.id);
    if (product) {
        await product.remove();
        res.send({ message: 'Product Deleted' });
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
});

export default handler;
