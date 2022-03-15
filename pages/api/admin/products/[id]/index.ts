import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { isAuth, isAdmin } from '../../../../../app/utils/auth';
import Product from '../../../../../models/Product';
import dbConnect from '../../../../../lib/dbConnect';

import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';
// import upload from '../../../../../app/utils/multer';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

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
        product.image = req.body.image || product.image;
        product.cloudinary_id_image =
            req.body.cloudinary_id_image || product.cloudinary_id_image;
        product.isFeatured = req.body.isFeatured || product.isFeatured;
        product.featuredImage = req.body.featuredImage || product.featuredImage;
        product.cloudinary_id_image =
            req.body.cloudinary_id_featuredImage ||
            product.cloudinary_id_featuredImage;
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
        // Clean Cloudinary //
        // Destroy old Image if it exists //
        product.cloudinary_id_image &&
            (await cloudinary.uploader.destroy(product.cloudinary_id_image));

        // Destroy old Featured Image if it exists //
        product.cloudinary_id_featuredImage &&
            (await cloudinary.uploader.destroy(
                product.cloudinary_id_featuredImage
            ));

        // Remove product from DB //
        await product.remove();
        res.send({ message: 'Product Deleted' });
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
});

export default handler;
