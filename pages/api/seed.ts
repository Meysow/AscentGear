import type { NextApiRequest, NextApiResponse } from 'next';

import nc from 'next-connect';
import dbConnect from '../../lib/dbConnect';
import Product from '../../models/Product';
import data from '../../app/utils/data';
import User from '../../models/User';

const handler = nc();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();
    try {
        await Product.deleteMany();
        await Product.insertMany(data.products);
        await User.deleteMany();
        await User.insertMany(data.users);
        res.status(200).json({ message: 'seeded successfully' });
    } catch (err) {
        console.log(err);
    }
});

export default handler;
