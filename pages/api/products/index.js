import nc from 'next-connect';
import db from '../../../app/utils/db';
import Product from '../../../app/models/Product';

const handler = nc();

handler.get(async (req, res) => {
    await db.connect();
    const products = await Product.find({});
    await db.disconnect();
    res.send(products);
});

export default handler;
