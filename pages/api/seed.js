import nc from 'next-connect';
import db from '../../app/utils/db';
import Product from '../../app/models/Product';
import data from '../../app/utils/data';

const handler = nc();

handler.get(async (req, res) => {
    await db.connect();
    await Product.deleteMany();
    await Product.insertMany(data.products);
    await db.disconnect();
    res.send({ message: 'seeded successfully' });
});

export default handler;
